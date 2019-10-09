const path=require('path');

module.exports={
    host: 'http://121.201.111.5:8080' ,
 
    currentRoot:'localupload',
    rootDirection:{
        localupload: path.join(__dirname, '../statics/upload')

    },

 
}