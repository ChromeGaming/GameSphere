//svg like function
function svg(data, info = [0,0,1,1]){
    ctx.save()
    ctx.translate(info[0],info[1])
    ctx.scale(info[2],info[3])
  
    for(let i=0; i < data.length; i++){
  
        if(data.charAt(i) == "p"){
            // p m x y or l x y, filled stroke,
            ctx.beginPath()
            let p = interpetData(data,i)
            for(let j =0; j<p.length; j++){
                if(p[j] == "m"){ctx.moveTo(p[j+1],p[j+2]);j+=2}
                else if(p[j] == "l"){ctx.lineTo(p[j+1],p[j+2]);j+=2}
                else{
                    ctx.closePath()
                    if(parseInt(p[j]))ctx.fill()
                    if(parseInt(p[j+1]))ctx.stroke()
                    break;
                }
                
            }
  
            ///CANNOT USE L OR M IN SVG FROM NOW ON
        }else if(data.charAt(i) == "w"){
            //stroke width
            //w stroke-width,
  
            ctx.lineWidth = interpetData(data, i)[0]
  
        }else if(data.charAt(i) == "g"){
            //global alpha
            //g alpha,
            
            ctx.globalAlpha = interpetData(data, i)[0]
  
        }else if(data.charAt(i) == "s"){
            //shadow blur
            //s blur,
  
            ctx.shadowBlur = interpetData(data, i)[0]*Math.abs(info[2])
  
        }else if(data.charAt(i) == "c"){
            //color
            //c #000000 fill stroke shadow,
            let c = interpetData(data, i)
  
            for(let j =1; j<c.length; j++){
                c[j] = parseInt(c[j])
            }
  
            if(c[1])ctx.fillStyle = c[0]
            if(c[2])ctx.strokeStyle = c[0]
            if(c[3])ctx.shadowColor = c[0]
  
            i+=c[0].length + 1
  
        }else if(data.charAt(i) == "a"){
            //arc
            //a x y radius start-angle-degrees end-angle-degrees fill stroke,
            let a = interpetData(data,i)
  
            ctx.beginPath()
            ctx.arc(a[0],a[1],a[2],a[3]*Math.PI/180,a[4]*Math.PI/180)
  
            if(parseInt(a[5]))ctx.fill()
            if(parseInt(a[6]))ctx.stroke()
  
        }else if(data.charAt(i) == "r"){
            //rect
            //r x y w h fill stroke,
            let r = interpetData(data, i)
  
            ctx.beginPath()
            ctx.rect(r[0],r[1],r[2],r[3])
  
            if(parseInt(r[4]))ctx.fill()
            if(parseInt(r[5]))ctx.stroke()
        }else if(data.charAt(i) == "<"){
            ctx.save()
        }else if(data.charAt(i) == ">"){
            ctx.restore()
        }else if(data.charAt(i) == "t"){
            //translate
            //x y,
            let t = interpetData(data, i)
            ctx.translate(t[0],t[1])
        }else if(data.charAt(i) == "q"){
            //rotate
            //angle,
            ctx.rotate(interpetData(data, i) * Math.PI / 180)
        }
    }
    ctx.restore()
  }
  
  //interpets svg data
  function interpetData(d,i){
        return d.slice(i+2,d.indexOf(",",i+2)).split(" ");
  }