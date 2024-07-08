import Globe, {CanvasGlobeProps} from "./Globe";
import Board from "./Board";
import React from "react";

interface ViewerProps extends CanvasGlobeProps {
    useGlobe: boolean
}

const Viewer = (props: ViewerProps) => {
    const boardProps: CanvasGlobeProps = props;
    const boardViewer = (!props.useGlobe) ?
        <Board
            {...boardProps}
            /*{mouseDown={props.mouseDown}*/
        />
        :
        <Globe
            {...boardProps}
        />
    ;
    return <>
        {boardViewer}
    </>
}

export default Viewer;
