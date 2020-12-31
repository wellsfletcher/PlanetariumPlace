import React from 'react';
import { connect } from "react-redux";
import { setTile } from "../actions/index";

import Canvas from './Canvas';


function mapDispatchToProps(dispatch) {
  return {
    setTile: ({x, y}, color) => dispatch(setTile({x, y, color}))
  };
}

/*
var draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
    ctx.fill();

    var x = 69;
    var y = 42;
    var r = 255;
    var g = 100;
    var b = 100;
    var a = 255;
    var id = ctx.createImageData(1,1); // only do this once per page
    var d  = id.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;
    ctx.putImageData( id, x, y );
};
*/

var drawAnimatedCircle = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
    ctx.fill();
};

var drawPixel = (ctx, x, y) => {
    var r = 255;
    var g = 100;
    var b = 100;
    var a = 255;
    var id = ctx.createImageData(1,1); // only do this once per page
    var d  = id.data;                        // only do this once per page
    d[0]   = r;
    d[1]   = g;
    d[2]   = b;
    d[3]   = a;
    ctx.putImageData(id, x, y);
};

var drawPixelBuffer = (ctx, pixels, bufferWidth) => {
    var width = bufferWidth;
    var height = pixels.length / width; // floor?

    // var bufferLength = width * height * 4;
    var bufferLength = pixels.length * 4;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const buffer = new Uint8ClampedArray(arrayBuffer);
    // console.log("buffer.length = " + buffer.length);

    var k = 0;
    for (var pixel of pixels) {
        const i = k * 4;
        var r = 255;
        var g = 100;
        var b = 100;
        var a = 255 * pixel;
        // console.log("pixel = " + pixel);

        buffer[i + 0]   = r; // red
        buffer[i + 1]   = g; // green
        buffer[i + 2]   = b; // blue
        buffer[i + 3]   = a; // alpha
        k++;
    }

    const imageData = new ImageData(buffer, width, height);
    ctx.putImageData(imageData, 0, 0);
};


class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canvasProps: {
                getBoundingClientRect: () => {return {top: 0, right: 0, bottom: 0, left: 0}} // rect: null // getBoundingClientRect
            }
        };

        this.setCanvasProps = this.setCanvasProps.bind(this);
    }

    // setCanvasProps(canvasProps) { // { rect }
    setCanvasProps({ getBoundingClientRect }) {
        this.setState({
            canvasProps: {
                getBoundingClientRect: getBoundingClientRect
            }
        });
    }

    render() {
        var tiles = this.props.tiles;
        var width = this.props.width;
        var height = tiles.length / width;

        var draw = (ctx, frameCount) => {
            drawAnimatedCircle(ctx, frameCount);
            drawPixel(ctx, 69, 42);
            drawPixelBuffer(ctx, tiles, width);
            /*
            drawPixelBuffer(
                ctx,
                [
                    1, 0, 0, 0, 1,
                    0, 1, 0, 1, 0,
                    0, 0, 1, 0, 0,
                    0, 1, 0, 1, 0,
                    1, 0, 0, 0, 1
                ],
                5
            );
            */
        };

        var zoom = {x: 2, y: 2};
        var pan = {x: 50, y: 50};
        var zoomedWidth = width * zoom.x;
        var zoomedHeight = height * zoom.y;

        var style = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // transform: `scale(2, 2)`
            transform: `scale(${zoom.x}, ${zoom.y})`
            // transform: "translate(${pan.x} px, $(pan.y) px)"
        };

        const handleCanvasClick = (event) => {
            // const rect = this.state.canvasProps.getBoundingClientRect();
            const rect = {
                left: width - zoomedWidth,
                top: height - zoomedHeight
            };
            const mouse = {x: Math.floor((event.clientX - rect.left) / zoom.x), y: Math.floor((event.clientY - rect.top)/ zoom.y)};
            var color = 1;
            this.props.setTile(mouse, color);
            // alert("Clicked!");
        }

        const handleMouseEnter = (event) => {
            // const rect = this.state.canvasProps.getBoundingClientRect();
            const rect = {
                left: width - zoomedWidth,
                top: height - zoomedHeight
            };
            const mouse = {x: Math.floor((event.clientX - rect.left) / zoom.x), y: Math.floor((event.clientY - rect.top)/ zoom.y)};
            // const mouse = {x: Math.floor(event.clientX / zoom.x), y: Math.floor(event.clientY / zoom.y)};
            // const mouse = {x: Math.floor(event.clientX / 1), y: Math.floor(event.clientY / 1)};
            var color = 1;

            if (this.props.mouseDown) {
                this.props.setTile(mouse, color);
                // alert("Clicked!");
                console.log(mouse);
            }
        }


        // var style = {};

        /*
        var style = {
            transform: [
                      { skewX: "30deg" },
                      { skewY: "30deg" }
                    ]
        };
        */


        // return <Canvas draw={draw} context="2d" width={300} height={500}/>;
        /*
        return (
            <div
                style={style}
                onClick={handleCanvasClick}
            >
                <Canvas
                    draw={draw}
                    context="2d"
                    width={width}
                    height={height}
                    setCanvasProps={this.setCanvasProps}

                    onMouseMove={handleMouseEnter}
                />
            </div>
        );
        */
        return  (
            <div
                style={style}
                onClick={handleCanvasClick}
            >
                <Canvas
                    draw={draw}
                    options={{
                        context: "2d"
                    }}
                    width={width}
                    height={height}
                    setCanvasProps={this.setCanvasProps}

                    onMouseMove={handleMouseEnter}
                />
            </div>
        );
    }
}

export default connect(
  null,
  mapDispatchToProps
)(Board);
