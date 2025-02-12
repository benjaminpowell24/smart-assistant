import React from 'react'
import { motion } from 'framer-motion'

const AnimatedText = ({ text }) => {
    const processText = (text) => {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>
                }
                return part
            })
            return (
                <React.Fragment key={i}>
                    {parts}
                </React.Fragment>
            )
        })
    }

    const characters = processText(text).map((line) => {
        return line.props.children.flatMap((part, i) =>
            typeof part === 'string'
                ? part.split(' ').map((word) => ({ word, key: `${i}-${word}` }))
                : [{ word: part, key: `${i}-bold` }]
        )
    }).flat()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
            },
        },
    }

    const characterVariants = {
        hidden: { opacity: 0, x: 0 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.1,
            },
        },
    }

    return (
        <div className="w-fit flex justify-center">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                {characters.map((char, index) => {
                    return (
                        <div key={index}>
                            {((!isNaN(Number(char.word[0])) && char.word[1] === ".") || (char.word[0] === '-')) && <><div key={index} style={{ width: '100%', height: '.5em' }} /></>}
                            <motion.span
                                key={index}
                                variants={characterVariants}
                                className="text-gray-700"
                                style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: '16px', display: 'inline-block' }}
                            >
                                {char.word}&nbsp;
                            </motion.span>
                            {(char.word === ":" && !((characters[index + 5].word[0] === '-') || (characters[index + 4].word[0] === '-'))) && <div key={index} style={{ width: '100%', height: '.5em' }} />}
                        </div>
                    )
                })}
            </motion.div>
        </div>
    )
}

export default AnimatedText
