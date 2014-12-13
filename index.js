/**
 * Created by Enjolras on 2014/11/26.
 */
var renderer=null,
    scene=null,
    camera=null,
    geometry=null,
    material=null,
    texture=null,
    picture=null,
    amount=0.0,
    needsToUpdate=false,
    slider=null;

$(function(){

    initScreen();

    initScene();

    onUpdate();

});

function initScreen(){

    var winW=window.innerWidth;
    var winH=window.innerHeight;

    $(window).on("resize",onResize);

    //$(window).on("mousedown",onMouseDown);

    $("canvas")/*.css("position","absolute")*/.attr({"width":winW,"height":winH});

    $("input[type=range]").on("input",onChange);

    $("input[type='file']").on("change", onFileChange);
}

function initScene(){

    var winW=window.innerWidth;
    var winH=window.innerHeight;

    renderer=new THREE.WebGLRenderer({canvas:$('canvas')[0],antialias:true});
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(winW, winH);

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(-winW/2,winW/2,winH/2,-winH/2);
    camera.position.set( 0, 0, 200 );
    scene.add( camera );

    texture=THREE.ImageUtils.loadTexture("assets/Hydrangeas.jpg");
    texture.magFilter=THREE.NearestFilter;
    texture.minFilter=THREE.NearestFilter;

    geometry=new THREE.PlaneGeometry(800,600,1,1);
    material=new THREE.ShaderMaterial({
        //side:THREE.DoubleSide,
        //wireframe:true,
        //wireframeLinewidth:10,
        uniforms:{
            map:{type:"t",value:texture},
            amount:{type:"f",value:0.0}
        },
        vertexShader:[
            "varying vec2 vUV;",
            "void main(){",
            "vUV=uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader:[
            "varying vec2 vUV;",
            "uniform sampler2D map;",
            "uniform float amount;",
            "void main(void) {",
                "highp vec4 texColor = texture2D( map, vUV );",
                //"float gray=dot(texColor.rgb,vec3(0.3,0.6,0.1));",
                //"vec3 grayColor=vec3(gray,gray,gray);",
                // "gl_FragColor=vec4(mix(texColor.rgb,vec3(gray,gray,gray),amount),1.0);",
                "float red=dot(texColor.rgb,vec3(-0.607,0.769,0.189))*amount+texColor.r;",
                "float green=dot(texColor.rgb,vec3(0.349,-0.314,0.168))*amount+texColor.g;",
                "float blue=dot(texColor.rgb,vec3(0.272,0.534,-0.869))*amount+texColor.b;",
                "gl_FragColor=vec4(clamp(vec3(red,green,blue),0.0,1.0),1.0);",
            "}"
        ].join("\n")
    });

    var mesh=new THREE.Mesh(geometry,material);
    scene.add(mesh);

    picture=mesh;
    amount=material.uniforms.amount;

    //needsToUpdate=true;

}

function onUpdate(){
    //if(!needsToUpdate) return;
    //console.log( amount);
    renderer.render(scene,camera);

    requestAnimationFrame(onUpdate);

    //needsToUpdate=false;
}


function onResize(evt){

    var winW=window.innerWidth;
    var winH=window.innerHeight;

    $("canvas")/*.css("position","absolute")*/.attr({"width":winW,"height":winH});

    renderer.setSize(winW, winH);
    camera.left=-winW/2;
    camera.right=winW/2;
    camera.top=winH/2;
    camera.bottom=-winH/2;
    camera.updateProjectionMatrix();

    //needsToUpdate=true;

}

function onChange(evt){
    amount.value=$("input[type=range]")[0].value;
    $("input[type=text]").attr("value",amount.value);
    //needsToUpdate=true;
}

function onFileChange(evt){
    
    var input=evt.target;
    
    if (input.files && input.files[0]) {
        
        var reader = new FileReader();
        
        reader.onload = function (e) {
            
            //$("img").attr("src", e.target.result);
            var im=$("<img>").attr("src",e.target.result)/*.on("load",onImgLoaded)*/[0];

            texture.image=im;
            texture.needsUpdate=true;

            geometry.vertices[0].set(-im.width/2,im.height/2,0);
            geometry.vertices[1].set(im.width/2,im.height/2,0);
            geometry.vertices[2].set(-im.width/2,-im.height/2,0);
            geometry.vertices[3].set(im.width/2,-im.height/2,0);
            geometry.verticesNeedUpdate=true;

            //needsToUpdate=true;
            
        }
            
        reader.readAsDataURL(input.files[0]);
        
    }
    
}

function onImgLoaded(evt){

    //if(picture){
        $(evt.target).off("load",onImgLoaded);
        //console.log(evt);
        //texture.needsUpdate=true;
        
    //}
    
}





