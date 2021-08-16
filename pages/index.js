import { Fragment, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Home = () => {
  const [imageList,setImageList] = useState([]);
  const [currentImg,setCurrentImg] = useState(null);
  const uploadImage = (e) => {
    if(e.target.files[0]) {
      var reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          setCurrentImg({name:e.target.files[0].name,img:reader.result});
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      setImageList([...imageList,e.target.files[0]]);
    }
  }
  const [data,setData] = useState([]);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    unit:'%'
  });
  const loadSaveImage = (index) => {
      console.log(index);
      var reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          setCurrentImg({name:imageList[index].name,img:reader.result});
        }
      }
      reader.readAsDataURL(imageList[index]);
  }
  const getCropImage = (_,percentCrop) => {
    setCrop(percentCrop);
    console.log(percentCrop);
  };
  const saveCrop = () => {
    let class_name = 'papaya';
    // class_name = prompt("Label");
    console.log(currentImg);
    setData([...data,{filename:currentImg.name,x:crop.x/100,y:crop.y/100,w:crop.width/100,h:crop.height/100,class_name:class_name}]);
  }
  const removeCrop = (index) => {
    setData([...data.slice(0,index),...data.slice(index+1,data.length)]);
  }
  const exportData = () => {
    let str = 'filename,x,y,w,h,class_name\n'
    for(let i in data) {
      let temp = []
      for(let j in data[i]) {
        temp.push(data[i][j])
      }
      str+=temp.join(',')+'\n'
    }
    var link = document.createElement('a');
    link.href = 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(str);
    link.target = '_blank';
    link.download = 'papaya_label.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <Fragment>

    <h1>Image Labeling</h1>
  <div className="container">
    <div className="column left">
      <h2>Image List</h2>
      <div className="file-box">
      {
        imageList.map((e,index)=><li key={index}>{e.name} <button className="pointer" onClick={()=>loadSaveImage(index)}>load</button></li>)
      }
      </div>
      <h2>Label List</h2>
      <div className="file-box">
      {
        data.map((e,index)=><li key={index}>{e.filename}: {e.class_name} <span className="pointer" onClick={()=>removeCrop(index)}>X</span></li>)
      }
      </div>
    </div>
    <div className="column right">
      <div className="mr">
      <button className="pointer" onClick={exportData}>Export</button>
      </div>
      <input  className="mr pointer" type="file" onChange={uploadImage} accept="image/*" />
      <div className="cropZone mr">
      <ReactCrop
              src={currentImg?.img}
              crop={crop}
              onChange={(_,percentCrop) => setCrop(percentCrop)}
              onComplete={getCropImage}
      />
      <button className="mr pointer" onClick={saveCrop}>Save</button>
      </div>
    </div>
  </div>
<style jsx>
  {
   `
   h1 {
     text-align:center;
   }
   .file-box {
    height:30vw;
    overflow:scroll;
   }
   .container {
     display:flex;
     width: 100vw;
     height:calc(100vh - 6rem);
     padding: 2rem;
   }
   .column {
     display:flex;
     flex-flow:column;
   }
   .left {
     width: 20vw;
   }
   .right{
     width: 80vw;
   }
   .mr {
     margin: .25rem 0;
   }
   .cropZone {
     width: 30vw;
     height: 30vh;
   }
   .pointer {
     cursor: pointer;
   }
   ` 
  }
</style>
  </Fragment>
    )
}

export default Home;