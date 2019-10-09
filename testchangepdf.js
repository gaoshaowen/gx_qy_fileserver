( async ()=>{
    const execsh =require('./util/execshell')
    
    try {
        var outfile = await execsh.changepdf('./test.jpg')    
        console.log(outfile)
    } catch (error) {
        console.log(error)
    }
    
   
})()