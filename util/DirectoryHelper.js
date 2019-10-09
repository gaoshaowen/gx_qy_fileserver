var fs = require("fs");  
var path = require("path");  

module.exports = {
// 递归创建目录 异步方法  
 mkdirs:function(dirname, callback) {  
    fs.exists(dirname,  (exists)=> {  
        if (exists) {  
            callback();  
        } else {  
            // console.log(path.dirname(dirname));  
            this.mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
                console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });  
        }  
    });  
}  ,

// 递归创建目录 同步方法
mkdirsSync:function(dirpath) {

    console.log(dirpath);
    if (fs.existsSync(dirpath)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirpath))) {
        fs.mkdirSync(dirpath);
        return true;
      }
    }


    // if (!fs.existsSync(path.dirname(dirpath))) {
    //     mkdirsSync(path.dirname(dirpath));
    //   }
    //   if (!fs.existsSync(dirpath)) {
    //     fs.mkdirSync(dirpath);
    //   }
    
  },

  
  getUploadDirName(){
      const date = new Date();
      let month = Number.parseInt(date.getMonth()) + 1;
      month = month.toString().length > 1 ? month : `0${month}`;
      let day =date.getDate()
      day = day.toString().length > 1 ? day : `0${day}`;

      const dir = `${date.getFullYear()}${month}${day}`;
      return dir;
  },

  
  getUploadFileName(ext){
    return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`;
  },

  checkDirExist(p) {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  },
  
  
  getUploadFileExt(name) {
    let ext = name.split('.');
    return ext[ext.length - 1];
  },

  getFileNameNoExt(data) {
    return data.substring(0,data.indexOf("."));
  },



}



// mkdirs('hello/a/b/c',() => {
//     console.log('done');
// })

// mkdirsSync('hello/a/b/c');