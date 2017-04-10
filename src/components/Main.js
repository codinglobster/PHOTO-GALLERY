require('normalize.css/normalize.css');
require('styles/App.scss');
//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

import React from 'react';
import ReactDOM from 'react-dom'

//利用自执行函数，将图片信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
  for(var i = 0;i < imageDatasArr.length;i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);
/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low,hegh){
  return Math.ceil(Math.random() * (hegh - low) + low);
}
/*
*获取任意30以内的读书
*/
function get30DegRandom(){
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

//imageDatas = genImageURL(imageDatas);
var ImgFigure = React.createClass({
  /*
  *ImgFigure的点击处理函数
  */
  handleClick:function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render:function(){
    var styleObj = {};
    //如果props属性中指定了这张图片的位置则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    //console.log(styleObj);
    //如果图片的旋转角度有值不为0，则添加旋转角度
    if(this.props.arrange.rotate){//前缀添加变了
      ['MozTransform','msTransform','WebkitTransform','tansform'].forEach(function(value){
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
      styleObj.boxShadow = '0 0 4px 0';
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return(
      <figure className={imgFigureClassName} style={styleObj} ref="figure" onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
        alt={this.props.data.title}/>
        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
});

//控制组件


var ControllerUnits = React.createClass({
  handleClick: function(e){
    e.preventDefault();
    e.stopPropagation();
  },
  render:function(){
    return(
      <span className="controller-unit" onClick={this.handleClick}></span>
    );
  }
});
var GalleryByReactApp = React.createClass({
  Constant:{
    centerPos:{
      left:0,
      right:0
    },
    hPosRange:{//水平方向取值范围
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0,0]
    },
    vPosRange:{
      x:[0,0],
      topY:[0,0],
      y:[0,0]
    }
  },
  /*
  * 翻转图片
  *@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  @return{function}这是一个闭包函数，其内return一个真正的待被执行的函数
  */
  inverse:function(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = ! imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },
/*
*重新布局所有图片
*@param centerIndex 指定剧中排布哪个图片
*/

  rearrange: function(centerIndex) {
    //----定义开始
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,

        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,

        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRighttSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,

        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),//上部放置一个或不放
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//返回被删除的元素
      //定义结束
        //首先剧中 centerIndex的图片
        imgsArrangeCenterArr[0]={
          pos:centerPos,
          rotate:'',
          isCenter:true
        }
        //剧中的centerIndex 的图片不需要旋转
        //取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index] = {
            pos:{
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter:false
          }
          // console.log(imgsArrangeTopArr[index].pos.top +"@22:" + topImgNum);
          // console.log(imgsArrangeTopArr[index].pos.left);
        });
        //布局左右两侧的图片
        for(var i = 0,j = imgsArrangeArr.length,k = j / 2; i < j; i++){
          var hPosRangeLORX = null;
          //前半部分布局左边，右半部分布局右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else{
            hPosRangeLORX = hPosRangeRighttSecX;
          }

          imgsArrangeArr[i] = {
            pos:{
              top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          }
        }
        //如果上部取值了，则将上部元素插回去，因为index不会自动消失，所以要手动插回去
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });
  },
  /*
  * 利用rearrange函数，居中对应index的图片
  * @param index,需要被居中的图片对应的图片信息数组的index值
  * @return {Function}
  */
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },
  getInitialState:function(){
    return {
      imgsArrangeArr:[
        // {
        //   /*pos:{
        //     left:'0',
        //     top:'0'
        //   }，
        //  rotate:0,
        //  isInverse:false
        // isCenter:false*/
        // }
      ]
    };
  },
  //组件加载以后，修改组件的定位
  componentDidMount:function(){
    //首先拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,//scroll是实际大小，client是可见大小，offset是整体大小
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
         //console.log(stageW+":"+halfStageH);
    //拿到第一个imageFigure的大小
    var imgFigureDOM = this.refs.imgFigure0.refs.figure,
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
        //console.log(halfStageH + ":"+halfImgH);
        this.Constant.centerPos = {
          left:halfStageW - halfImgW,
          top:halfStageH - halfImgH
        }
        //计算左侧，右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;
        //计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        this.rearrange(0);

  },
  render:function() {
  var controllerUnits = [],
      imgFigures = [];
  imageDatas.forEach(function(value,index){//根据导入json数据的照片名称，引入所有需要引入的照片元素，再将Url地址赋予每个照片元素对象
    if(!this.state.imgsArrangeArr[index]){
      this.state.imgsArrangeArr[index] = {
        pos:{
          left:0,
          top:0
        },
        rotate:0,
        isInverse:false,
        isCenter:false
      }
    }
    //console.log(this.state.imgsArrangeArr[index]);
    imgFigures.push(<ImgFigure data = {value} key = {index} ref={'imgFigure' + index}
    arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);//value为照片对象，数组储存的都是react组件，组件的具体内容由ImgFigure来配置

    controllerUnits.push(<ControllerUnits key={index}/>)
  }.bind(this));
    return (
      <section className = "stage" ref="stage">
        <section className = "img-sec">
          {imgFigures}
        </section>
        <nav className = "controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
