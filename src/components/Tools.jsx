import circleIcon from '../assets/icons/circle.svg';
import rectIcon from '../assets/icons/rect.svg';
import arrowIcon from '../assets/icons/arrow.svg';
import moveIcon from '../assets/icons/move.svg'
import textIcon from '../assets/icons/text.svg'


export default function Tools({currentShape, onHandleClick}){

    return(
        <div className="tools">

            <button className={`toolBtns ${currentShape === 'move' ? 'active' : ''}`} 
            id="rectShapeBtn" onClick={()=>onHandleClick('move')}>
                <img src={moveIcon}/></button>

            <button className={`toolBtns ${currentShape === 'rect' ? 'active' : ''}`} 
            id="rectShapeBtn" onClick={()=>onHandleClick('rect')}>
                <img src={rectIcon}/></button>

            <button className={`toolBtns ${currentShape === 'circle' ? 'active' : ''}`}
            id="circleShapeBtn" onClick={()=>onHandleClick('circle')}>
                <img src={circleIcon}/></button>

            <button className={`toolBtns ${currentShape === 'arrow' ? 'active' : ''}`}
            id="arrowShapeBtn" onClick={()=>onHandleClick('arrow')}>
                <img src={arrowIcon}/></button>

            <button className={`toolBtns ${currentShape === 'text' ? 'active' : ''}`} 
            id="rectShapeBtn" onClick={()=>onHandleClick('text')}>
                <img src={textIcon}/></button>
        </div>
    )
}