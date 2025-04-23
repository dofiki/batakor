import downloadIcon from '../assets/icons/download.svg';

export default function EditFunction(){
    return(
        <>
        <div className='editFunction'>
        <div className="editFunctionTop">
            <button>Undo</button>
            <button>Redo</button>
        </div>
        <div className="editFunctionMiddle">
            <button>Reset</button>
        </div>
        <div className="editFunctionDown">
            <button><img src={downloadIcon} /></button>
        </div>
        </div>
        </>
    )
}