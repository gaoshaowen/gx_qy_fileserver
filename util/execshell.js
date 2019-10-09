const path = require('path')
const os = require("os")

var exec = require('child_process').exec, child;

module.exports = {
    changepdf( src_file ){

        var dirname = path.dirname( src_file)
        var shortname = path.basename(src_file)
        var index = shortname.lastIndexOf('.')
        shortname = shortname.substring(0, index) + '.pdf'
        var outfile = path.join( dirname , shortname)

        exec_path = `curl --form file=@${src_file} http://121.201.111.5:5000/unoconv/pdf/ > ${outfile} `
        let p = new Promise( (resolve, reject)=>{

            child = exec(exec_path,function (error, stdout, stderr){          
                if(error !== null){   
                    return reject( error )
                }
                
                return resolve( outfile )      
            })

        })

        return p

    }
}