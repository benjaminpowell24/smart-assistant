import { Flashy } from 'iconsax-react'
import AnimatedText from './AnimateText'
import SpeechSynthesisWidget from './speechToText'

const AIMessage = ({ text, citation, isOld }) => {

    if (typeof text === 'object' && text !== null) {
        text = JSON.stringify(text);
    }

    return (
        <div className='w-2/3 flex-none gap-2 relative'>
            <Flashy size={24} color='#4F2682' variant='Bulk' className='absolute top-3 -left-8' />
            <div className='max-w-full border rounded-lg p-2.5 flex-1'>
                {
                    isOld ? (
                        <p>{text}</p>
                    ) : (
                        <AnimatedText text={text ?? "No text added"} />
                    )
                }
                {
                    Array.isArray(citation) && citation.length > 0 &&
                    <div className='mt-4'>
                        <h2>References</h2>
                        {
                            Array.isArray(citation) &&
                            citation.map((item, index) => (
                                <>
                                    <span key={index} className='text-blue-600 text-sm'>{item}&nbsp;&nbsp;</span>
                                    <br />
                                </>
                            ))
                        }
                    </div>
                }
            </div>
            <SpeechSynthesisWidget text={text} />
        </div>
    )
}

export default AIMessage