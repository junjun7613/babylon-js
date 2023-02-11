import { Engine, Scene, ArcRotateCamera, Vector3, MeshBuilder, StandardMaterial, Color3, HemisphericLight, ActionManager, ExecuteCodeAction, DynamicTexture } from "@babylonjs/core";
import * as BABYLON from 'babylonjs';
import * as Materials from 'babylonjs-materials';
import {GUI} from "babylonjs-gui";
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D';
//import { GLTFLoader } from "@babylonjs/loaders/glTF/2.0/glTFLoader";
import objectDataOrig from './objectData.js';
import "@babylonjs/loaders";

/*
const createScene = (canvas) => {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  new HemisphericLight("light", Vector3.Up(), scene);

  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  const material = new StandardMaterial("box-material", scene);
  material.diffuseColor = Color3.Blue();
  box.material = material;

  const object = BABYLON.SceneLoader.ImportMeshAsync("mesh", "https://jo-fil-ho.com/babylonJS/", "test.glb", scene, function(scene){
    console.log(scene)
  });

  

  engine.runRenderLoop(() => {
    scene.render();
  });
};
*/

const createScene = (canvas) => {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    scene.enablePhysics();

    const camera = new ArcRotateCamera("camera", new Vector3(0, 2, -20));
    //camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    const light = new HemisphericLight("light", new Vector3(1, 1, 0));
    light.intensity = 1.5;

    const listMeshes = [];
    const listButtons = [];

    const resolveArray = [];

    const objectData = objectDataOrig["objectData"]

    for (let i = 0; i < objectData.length; i++) {

        console.log(objectData[i])

        //let resolve = BABYLON.SceneLoader.ImportMeshAsync("", "@/assets/inscription1/", objectData[i].url, scene).
        let resolve = BABYLON.SceneLoader.ImportMeshAsync("", "./src/assets/inscription1/", objectData[i].url, scene).
            //BABYLON.SceneLoader.ImportMeshAsync("", "https://jo-fil-ho.com/babylonJS/", objectData[i].url).
            then(function (result) {
                //object全体の位置を決定
                object = result.meshes[0]
                object.position.y = objectData[i].objectPosition.y;
                object.position.x = objectData[i].objectPosition.x;
                object.position.z = objectData[i].objectPosition.z;
                if (objectData[i].objectRotation.x !== 0) {
                    object.rotate(Axis.X, Math.PI / objectData[i].objectRotation.x, Space.WORLD);
                }
                if (objectData[i].objectRotation.y !== 0) {
                    object.rotate(Axis.Y, Math.PI / objectData[i].objectRotation.y, Space.WORLD);
                }
                if (objectData[i].objectRotation.z !== 0) {
                    object.rotate(Axis.Z, Math.PI / objectData[i].objectRotation.z, Space.WORLD);
                }

                //ここからメッシュごとの処理
                for (let k = 0; k < objectData[i].meshes.length; k++) {

                    const objectPosition = objectData[i].objectPosition

                    const meshData = objectData[i].meshes[k]
                    console.log(meshData)

                    const meshName = objectData[i].meshes[k].meshName

                    const meshType = objectData[i].meshes[k].type

                    const planePositions = objectData[i].meshes[k].textPlane.textPlanePosition

                    const textFont = objectData[i].meshes[k].textPlane.textFont

                    const transcriptions = objectData[i].meshes[k].transcriptions

                    const annotation = objectData[i].meshes[k].annotation

                    const detailCardPosition = objectData[i].meshes[k].detailCardPosition

                    const metaData = objectData[i].meshes[k].metaData

                    const data = objectData[i].meshes[k].metaData.items

                    //sceneから、データのmeshNameに一致するメッシュデータを取得
                    const meshDict = {}

                    const mesh = scene.getMeshByName(meshName)
                    //mesh.addBehavior(new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(1,1,0)}));
                    console.log(mesh)
                    meshDict.meshOrig = meshData
                    meshDict.meshScene = mesh
                    //listMeshes.push(meshDict)
                    listMeshes.push(meshDict)

                    //メッシュの元のマテリアルを取得
                    origMaterial = mesh.material
                    console.log(origMaterial)

                    const listTextDatas = [];

                    for (const transcription of transcriptions) {

                        const textData_list = []

                        const texts = transcription.texts

                        for (const tx of texts) {

                            let textData = function () {
                                // inscription1.position.x -= 0.05;

                                const mesh_list = []

                                // Set font type
                                var font_type = "Arial";

                                // Set width an height for plane
                                var planeWidth = 5;
                                //var planeWidth =15;
                                var planeHeight = 0.5;
                                //var planeHeight = 1.5;

                                for (let i = 0; i < tx.text.length; i++) {
                                    console.log(tx.text[i]);

                                    var plane = MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight }, scene);
                                    //plane.position.y = planePositions[i].y;
                                    plane.position.y = objectPosition.y + planePositions[i].y;
                                    //plane.position.x = planePositions[i].x;
                                    plane.position.x = objectPosition.x + planePositions[i].x;
                                    //plane.position.z = planePositions[i].z;
                                    plane.position.z = objectPosition.z + planePositions[i].z;
                                    //plane.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
                                    plane.scaling = new Vector3(0.1, 0.1, 0.1);
                                    console.log(planePositions[i].rotation.y)
                                    if (planePositions[i].rotation.y !== 0) {
                                        //plane.rotate(BABYLON.Axis.Y,Math.PI / planePositions[i].rotation.y, BABYLON.Space.WORLD)
                                        plane.rotate(Axis.Y, planePositions[i].rotation.y * Math.PI / 180, Space.WORLD)
                                    }
                                    plane.setParent(mesh);

                                    var DTWidth = planeWidth * 60;
                                    var DTHeight = planeHeight * 60;

                                    var text = tx.text[i];

                                    var dynamicTexture = new DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene);

                                    // Check width of text for given font type at any size of font
                                    var ctx = dynamicTexture.getContext();
                                    var size = 12; //any value will work
                                    ctx.font = size + "px " + font_type;
                                    var textWidth = ctx.measureText(text).width;

                                    // Calculate ratio of text width to size of font used
                                    var ratio = textWidth / size;

                                    // set font to be actually used to write text on dynamic texture
                                    // var font_size = Math.floor(DTWidth / (ratio * 1)); //size of multiplier (1) can be adjusted, increase for smaller text
                                    //var font_size = 16
                                    var font_size = textFont
                                    var font = font_size + "px " + font_type;

                                    // Draw text
                                    dynamicTexture.drawText(text, null, null, font, "#000000", "transparent", true);

                                    var mat = new StandardMaterial("mat", scene);
                                    mat.diffuseTexture = dynamicTexture;
                                    mat.diffuseTexture.hasAlpha = true;

                                    // apply material
                                    plane.material = mat;

                                    plane.isVisible = false;

                                    mesh_list.push(plane)

                                }

                                return mesh_list;

                            };

                            const text_list = textData()
                            console.log(text_list)

                            var makeCard = function (title, positionObject) {

                                //eval('const card_' + number + ' = BABYLON.MeshBuilder.CreateBox("box", { height: 3, width: 2, depth: 0.2 });');
                                let card = MeshBuilder.CreateBox(transcription.lang, { height: 1, width: 2, depth: 0.2 });
                                //card.position = new BABYLON.Vector3(positionObject.x, positionObject.y, positionObject.z);
                                card.position = new Vector3(objectPosition.x + positionObject.x, objectPosition.y + positionObject.y, objectPosition.z + positionObject.z);
                                //card.scaling.x = 0.1;
                                //card.scaling.y = 0.1;
                                //card.scaling.z = 0.05;
                                card.scaling.x = mesh.scaling.x * 2;
                                card.scaling.y = mesh.scaling.y * 2.5;
                                card.scaling.z = mesh.scaling.z;
                                //card.rotation = new BABYLON.Vector3(0, -0.5, 0);
                                card.setParent(mesh)
                                let plane = MeshBuilder.CreatePlane("plane", { height: 1, width: 2 });
                                plane.parent = card;
                                plane.position.z = -0.11;

                                var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

                                let panel = new GUI.StackPanel();
                                panel.verticalAlignment = 0;

                                advancedTexture.addControl(panel);

                                let ttl = new GUI.TextBlock(tx.title);
                                ttl.text = tx.title;
                                ttl.color = "black";
                                ttl.fontSize = 150;
                                ttl.height = "200px";
                                ttl.textHorizontalAlignment = 0;
                                ttl.textVerticalAlignment = 0;
                                ttl.paddingTop = "5%";
                                ttl.paddingButtom = 2;
                                ttl.paddingLeft = 40;
                                ttl.paddingRight = 40;
                                panel.addControl(ttl);
                                advancedTexture.addControl(ttl);

                                let date = new GUI.TextBlock();
                                date.text = tx.year;
                                date.color = "black";
                                date.fontSize = 120;
                                date.height = "200px";
                                date.textHorizontalAlignment = 0;
                                date.textVerticalAlignment = 0;
                                date.paddingTop = "5%";
                                date.paddingLeft = 40;
                                date.paddingRight = 40;
                                panel.addControl(date);
                                advancedTexture.addControl(date);

                                let note = new GUI.TextBlock();
                                note.fontFamily = "Tahoma, sans-serif";
                                note.text = tx.author;
                                note.textWrapping = true;
                                note.color = "black";
                                note.fontSize = 120;
                                note.height = "200px";
                                note.textHorizontalAlignment = 0;
                                note.textVerticalAlignment = 0;
                                note.paddingTop = "5%";
                                note.paddingLeft = 40;
                                note.paddingRight = 40;
                                panel.addControl(note);
                                advancedTexture.addControl(note);

                                let button1 = GUI.Button.CreateSimpleButton("but1", "Show text");
                                button1.width = 1;
                                button1.height = "200px";
                                button1.color = "white";
                                button1.fontSize = 150;
                                button1.background = "green";
                                button1.paddingTop = "1%";
                                button1.paddingLeft = 40;
                                button1.paddingRight = 40;
                                button1.paddingButtom = "5%";
                                button1.onPointerUpObservable.add(function () {
                                    //alert("you did it!");

                                    for (const txt of text_list) {

                                        console.log(txt)

                                        if (txt.isVisible == false) {
                                            txt.isVisible = true;
                                        } else {
                                            txt.isVisible = false;
                                        }
                                    }
                                });
                                button1.verticalAlignment = 1;
                                advancedTexture.addControl(button1);

                                card.isVisible = false;
                                plane.isVisible = false;
                                ttl.isVisible = false;
                                date.isVisible = false;
                                note.isVisible = false;
                                panel.isVisible = false;
                                button1.isVisible = false;

                                return [card, plane, ttl, date, note, panel, button1];
                                //return [card,title,date,panel,button1];


                            }

                            const showCards = makeCard(tx.title, tx.positionObject)
                            textData_list.push(showCards)


                        };

                        console.log(textData_list)
                        listTextDatas.push(textData_list)

                        var button = MeshBuilder.CreateCylinder("button", { radius: 0.5, height: 0.2 }, scene)
                        //button_1.position.y = 0.35;
                        //button.position.y = transcription.button.buttonPosition.y;
                        button.position.y = objectPosition.y + transcription.button.buttonPosition.y;
                        button.position.x = objectPosition.x + transcription.button.buttonPosition.x;
                        button.position.z = objectPosition.z + transcription.button.buttonPosition.z;
                        button.scaling.y = 0.05;
                        button.scaling.x = 0.05;
                        button.scaling.z = 0.05;
                        button.rotation.y = Math.PI / 1;
                        button.rotation.x = Math.PI / -2;
                        button.rotation.z = Math.PI / 1;
                        button.setParent(mesh)

                        button.material = new StandardMaterial("mat_button", scene);
                        button.material.diffuseTexture = new BABYLON.Texture(transcription.button.buttonImage);
                        //button.material.diffuseTexture = new BABYLON.Texture("./textures/french.png");
                        //button_1.material.diffuseTexture = new BABYLON.Texture("https://jo-fil-ho.com/babylonJS/french.png");

                        // add actionManager on each cyl
                        button.actionManager = new ActionManager(scene);
                        // register 'pickCylinder' as the handler function for cylinder picking action.
                        button.actionManager.registerAction(
                            new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
                                for (const textData of textData_list) {

                                    console.log(textData[0].name)

                                    for (const showCard of textData) {
                                        console.log(showCard)
                                        console.log(showCard.name)
                                        if (showCard.isVisible == false) {
                                            showCard.isVisible = true;
                                            textData[1].position.z = -0.12;
                                            //showCard.position.z = planePositions[0].z-0.1;
                                        } else {
                                            showCard.isVisible = false;
                                            textData[1].position.z = -0.11;
                                            //textData[0].position.z = objectPosition.z + positionObject.z;
                                            //showCard.position.z = planePositions[0].z;
                                        }
                                    }
                                }
                            })
                        );
                        listButtons.push(button)
                    }

                    const anno_list = []

                    for (const anno of annotation) {

                        const anno_map = {}
                        anno_map.position = anno.position;
                        anno_map.scale = anno.scale;

                        console.log(anno.contentImage.length)
                        console.log(anno.position.x)

                        var font_type = "Arial";
                        //const planeWidth = 2;
                        const planeWidth = anno.scale.y * 40;
                        //const planeHeight = 2;
                        const planeHeight = anno.scale.y * 40;


                        //視点に追随するviewerを表示する場合

                        var advancedTextureDetail = AdvancedDynamicTexture.CreateFullscreenUI("UI");


                        var sv = new GUI.ScrollViewer();
                        sv.thickness = 2;
                        sv.color = "black";
                        sv.height = 0.2;
                        sv.width = 0.6;
                        sv.background = "white";
                        sv.isVisible = false;

                        advancedTextureDetail.addControl(sv);

                        var tb = new GUI.TextBlock();
                        //tb.textWrapping = true;
                        tb.textWrapping = GUI.TextWrapping.WordWrap;
                        tb.resizeToFit = true;
                        //tb.height = 2;
                        //tb.width = 2;
                        tb.paddingTop = "1%";
                        tb.paddingLeft = "10px";
                        tb.paddingRight = "22%"
                        tb.paddingBottom = "1%";
                        //tb.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                        //tb.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                        //tb.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                        //tb.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                        tb.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                        tb.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                        tb.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                        tb.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                        tb.color = "black";
                        //tb.isVisible = false;

                        tb.text = anno.note;
                        //tb.text = "TEXT START Lorem ipsum dolor sit amet, postea petentium et eum."

                        //tb.fontSize = anno.scale.y * 1500
                        //tb.fontSize = planeHeight * 30
                        tb.fontSize = 16


                        //テスト、イメージを含むsv構築
                        var makeSVImage = function () {
                            var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

                            var SVImgae = new GUI.ScrollViewer();
                            SVImgae.thickness = 5;
                            SVImgae.color = "black";
                            SVImgae.width = "800px";
                            SVImgae.height = "500px";
                            SVImgae.background = "white";
                            SVImgae.isVisible = false;

                            advancedTexture.addControl(SVImgae);

                            var gd = new GUI.Grid();
                            gd.width = "700px";
                            console.log(anno.contentImage.length)

                            const rowNumber = anno.contentImage.length + 1;

                            //console.log(rowNumber)
                            gd.height = String(rowNumber * 400) + "px";
                            gd.paddingTop = "15%";
                            //gd.addColumnDefinition(1 / 3);
                            //gd.addColumnDefinition(1 / 3);
                            //gd.addColumnDefinition(1 / 3);
                            gd.addColumnDefinition(7 / 10);
                            gd.addColumnDefinition(3 / 10);

                            if (anno.contentImage.length !== 0) {
                                for (let i = 0; i < anno.contentImage.length + 1; i++) {
                                    gd.addRowDefinition(1 / anno.contentImage.length + 1);
                                };
                            } else {
                                gd.addRowDefinition(1 / 1);
                            };


                            SVImgae.addControl(gd);

                            let backButton = GUI.Button.CreateSimpleButton("but1", "Back");
                            backButton.width = "100px";
                            backButton.height = "50px";
                            backButton.color = "black";
                            backButton.background = "black";
                            //button1.paddingLeft = "90%";
                            backButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                            backButton.color = "white";
                            backButton.fontSize = 16;
                            backButton.onPointerUpObservable.add(function () {
                                //alert("you did it!");
                                console.log(gd)
                                if (SVImage.isVisible == false) {
                                    SVImage.isVisible = true;
                                } else {
                                    SVImage.isVisible = false;
                                }
                            });
                            gd.addControl(backButton, 0, 0)

                            if (anno.contentImage.length !== 0) {

                                for (const [index, value] of anno.contentImage.entries()) {
                                    console.log([index, value])

                                    var image = new GUI.Image("but", value["item"]);
                                    //image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                    image.width = 0.9;
                                    image.height = 0.9;
                                    //image.populateNinePatchSlicesFromImage = true;
                                    //image.stretch = BABYLON.GUI.Image.STRETCH_NINE_PATCH;
                                    image.stretch = GUI.Image.STRETCH_UNIFORM;

                                    var text = new GUI.TextBlock();
                                    text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                    //text.text = "Hello!\nHello!\nHello!\nHello!";
                                    text.text = `Note: ${value.note}`;
                                    text.fontSize = 16;
                                    text.textWrapping = true;

                                    gd.addControl(image, index + 1, 0);
                                    gd.addControl(text, index + 1, 1);
                                    console.log(index + 1);

                                }
                            } else {
                                var text = new GUI.TextBlock();
                                text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                text.text = "No Image!";
                                text.textWrapping = true;
                                gd.addControl(text, 0, 1)
                            };

                            return SVImgae;
                        };

                        const SVImage = makeSVImage()
                        console.log(SVImage)

                        let imageButton = GUI.Button.CreateSimpleButton("but1", "Image");
                        imageButton.width = 0.3;
                        imageButton.height = "50px";
                        //button1.paddingLeft = "90%";
                        imageButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                        imageButton.color = "white";
                        imageButton.fontSize = 16;
                        imageButton.background = "green";
                        imageButton.paddingTop = "1%";
                        imageButton.paddingBottom = "5%";
                        imageButton.paddingLeft = "10%";
                        imageButton.onPointerUpObservable.add(function () {
                            
                            if (SVImage.isVisible == false) {
                                SVImage.isVisible = true;
                            } else {
                                SVImage.isVisible = false;
                            }
                            
                        });
                        //listButtons.push(button)

                        sv.addControl(tb)
                        sv.addControl(imageButton)

                        //anno_map.plane = plane;
                        anno_map.sv = sv;
                        anno_list.push(anno_map)
                    }
                    for (const anno of anno_list) {
                        console.log(anno)
                        var button = MeshBuilder.CreateCylinder("button", { radius: 0.5, height: 0.2 }, scene)

                        button.position.y = objectPosition.y + anno.position.y;
                        button.position.x = objectPosition.x + anno.position.x;
                        button.position.z = objectPosition.z + anno.position.z;
                        //button.position.y = mesh.absolutePosition.y + anno.position.y;
                        //button.position.x = mesh.absolutePosition.x + anno.position.x;
                        //button.position.z = mesh.absolutePosition.z + anno.position.z;

                        //button.scaling.x = anno.scale.x;
                        //button.scaling.y = anno.scale.y;
                        //button.scaling.z = anno.scale.z;
                        button.scaling.x = mesh.scaling.x * 0.5;
                        button.scaling.y = mesh.scaling.y * 0.5;
                        button.scaling.z = mesh.scaling.z * 0.5;
                        button.rotation.y = Math.PI / 1;
                        button.rotation.x = Math.PI / -2;
                        button.rotation.z = Math.PI / 1;
                        button.setParent(mesh)

                        button.material = new StandardMaterial("mat_button", scene);
                        //button.material.diffuseColor = BABYLON.Color3.Random();
                        button.material.diffuseTexture = new BABYLON.Texture("./textures/comment.png");
                        //button.material.diffuseTexture = new BABYLON.Texture("https://jo-fil-ho.com/babylonJS/comment.png");

                        // add actionManager on each cyl
                        button.actionManager = new ActionManager(scene);
                        // register 'pickCylinder' as the handler function for cylinder picking action.
                        button.actionManager.registerAction(
                            new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {

                                if (anno.sv.isVisible === false) {
                                    anno.sv.isVisible = true;
                                } else {
                                    anno.sv.isVisible = false;
                                }

                            })
                        );
                        listButtons.push(button)
                    }



                    const data_list = []

                    for (const datum of data) {

                        var makeCard = function (item, itemDetail, positionObject, detailCardPosition) {


                            var makeDetailCard = function (positionObject) {

                                var sv = new GUI.ScrollViewer();
                                sv.thickness = 5;
                                sv.color = "black";
                                //sv.width = 1;
                                //sv.height = 1;
                                sv.width = 0.8;
                                sv.height = 0.6;
                                sv.background = "white";
                                sv.isVisible = false;

                                advancedTextureDetail.addControl(sv);

                                const info_list = []
                                const itemDetailKeys = Object.keys(itemDetail)
                                for (let i = 0; i < itemDetailKeys.length; i++) {
                                    const paddingTopParam = 5 + i * 10
                                    console.log(paddingTopParam)

                                    const key = itemDetailKeys[i]

                                    var Info = new GUI.TextBlock();
                                    Info.fontFamily = "Tahoma, sans-serif";
                                    Info.text = key + ": " + itemDetail[key];
                                    Info.textWrapping = true;
                                    Info.color = "black";
                                    Info.fontSize = 30;
                                    Info.resizeToFit = true;
                                    Info.paddingTop = String(paddingTopParam) + "%";
                                    Info.paddingLeft = "30px";
                                    Info.paddingRight = "20px";
                                    Info.paddingBottom = "5%";
                                    Info.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                    Info.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                    Info.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                                    Info.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
                                    Info.isVisible = false;

                                    //metaInfoTextBlock = metaInfo;

                                    sv.addControl(Info);
                                    info_list.push(Info)
                                }
                                console.log(info_list)

                                //return { uiInfo: [detailCard, detailPlane, sv], metaInfo: info_list }
                                return { uiInfo: [sv], metaInfo: info_list }
                            }

                            const detailCards = makeDetailCard(datum.positionObject)

                            var makeSVImage = function () {
                                var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

                                var SVImgae = new GUI.ScrollViewer();
                                SVImgae.thickness = 5;
                                SVImgae.color = "black";
                                SVImgae.width = "800px";
                                SVImgae.height = "500px";
                                SVImgae.background = "white";
                                SVImgae.isVisible = false;

                                advancedTexture.addControl(SVImgae);

                                var gd = new GUI.Grid();
                                gd.width = "700px";
                                const rowNumber = datum.itemImage.length + 1;
                                console.log(rowNumber)
                                gd.height = String(rowNumber * 400) + "px";
                                gd.paddingTop = "15%";
                                //gd.addColumnDefinition(1 / 3);
                                //gd.addColumnDefinition(1 / 3);
                                //gd.addColumnDefinition(1 / 3);
                                gd.addColumnDefinition(7 / 10);
                                gd.addColumnDefinition(3 / 10);
                                
                                if (datum.itemImage.length !== 0) {
                                    for (let i = 0; i < datum.itemImage.length + 1; i++) {
                                        gd.addRowDefinition(1 / datum.itemImage.length + 1);
                                    };
                                } else {
                                    gd.addRowDefinition(1 / 1);
                                };
                                
                                SVImgae.addControl(gd);

                                let backButton = GUI.Button.CreateSimpleButton("but1", "Back");
                                backButton.width = "100px";
                                backButton.height = "50px";
                                backButton.color = "black";
                                backButton.background = "black";
                                //button1.paddingLeft = "90%";
                                backButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                backButton.color = "white";
                                backButton.fontSize = 16;
                                backButton.onPointerUpObservable.add(function () {
                                    //alert("you did it!");
                                    console.log(gd)
                                    if (SVImage.isVisible == false) {
                                        SVImage.isVisible = true;
                                    } else {
                                        SVImage.isVisible = false;
                                    }
                                    
                                });
                                gd.addControl(backButton, 0, 0)

                                if (datum.itemImage.length !== 0) {

                                    for (const [index, value] of datum.itemImage.entries()) {
                                        console.log([index, value])

                                        var image = new GUI.Image("but", value["item"]);
                                        //image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                        image.width = 0.9;
                                        image.height = 0.9;
                                        //image.populateNinePatchSlicesFromImage = true;
                                        //image.stretch = BABYLON.GUI.Image.STRETCH_NINE_PATCH;
                                        image.stretch = GUI.Image.STRETCH_UNIFORM;

                                        var text = new GUI.TextBlock();
                                        text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                        //text.text = "Hello!";
                                        text.text = `Note: ${value.note}`;
                                        text.fontSize = 16;
                                        text.textWrapping = true;


                                        gd.addControl(image, index + 1, 0);
                                        gd.addControl(text, index + 1, 1);
                                        console.log(index + 1);

                                    }
                                } else {
                                    var text = new GUI.TextBlock();
                                    text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                                    text.text = "No Image!";
                                    text.textWrapping = true;
                                    gd.addControl(text, 0, 1)
                                };

                                return SVImgae;
                            };

                            const SVImage = makeSVImage();


                            let card = MeshBuilder.CreateBox("box", { height: 1, width: 2, depth: 0.2 });
                            card.position = new Vector3(objectPosition.x + positionObject.x, objectPosition.y + positionObject.y, objectPosition.z + positionObject.z);
                            //card.scaling.x = 0.1;
                            //card.scaling.y = 0.1;
                            //card.scaling.z = 0.05;
                            card.scaling.x = mesh.scaling.x * 2;
                            card.scaling.y = mesh.scaling.y * 2.5;
                            card.scaling.z = mesh.scaling.z;
                            card.background = "white",
                                card.thickness = 1;
                            //card.rotation = new BABYLON.Vector3(0, -0.5, 0);
                            card.setParent(mesh)

                            let plane = MeshBuilder.CreatePlane("plane", { height: 1, width: 2 });
                            plane.background = "",
                                plane.parent = card;
                            //plane.parent = sv;
                            plane.position.z = -0.11;

                            var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
                            //advancedTextureDetail.addControl(sv);

                            let panel = new GUI.StackPanel();
                            panel.verticalAlignment = 0;

                            advancedTexture.addControl(panel);

                            let title = new GUI.TextBlock(item.title);
                            title.text = item.title;
                            title.color = "black";
                            title.fontSize = 120;
                            title.height = "200px";
                            title.textHorizontalAlignment = 0;
                            title.textVerticalAlignment = 0;
                            title.paddingTop = "5%";
                            title.paddingButtom = 2;
                            title.paddingLeft = 40;
                            title.paddingRight = 40;
                            panel.addControl(title);
                            advancedTexture.addControl(title);

                            let date = new GUI.TextBlock();
                            date.text = item.year;
                            date.color = "black";
                            date.fontSize = 100;
                            date.height = "200px";
                            date.textHorizontalAlignment = 0;
                            date.textVerticalAlignment = 0;
                            date.paddingTop = "5%";
                            date.paddingLeft = 40;
                            date.paddingRight = 40;
                            panel.addControl(date);
                            advancedTexture.addControl(date);

                            let note = new GUI.TextBlock();
                            note.fontFamily = "Tahoma, sans-serif";
                            note.text = item.author;
                            note.textWrapping = true;
                            note.color = "black";
                            note.fontSize = 100;
                            note.height = "200px";
                            note.textHorizontalAlignment = 0;
                            note.textVerticalAlignment = 0;
                            note.paddingTop = "5%";
                            note.paddingLeft = 40;
                            note.paddingRight = 40;
                            panel.addControl(note);
                            advancedTexture.addControl(note);

                            let button1 = GUI.Button.CreateSimpleButton("but1", "Text");
                            button1.width = 0.4;
                            button1.height = "200px";
                            button1.color = "white";
                            button1.fontSize = 100;
                            button1.background = "green";
                            button1.paddingTop = "1%";
                            button1.paddingBottom = "5%";
                            button1.paddingLeft = "10%";
                            //button1.paddingRight = 70;
                            button1.onPointerUpObservable.add(function () {
                                //alert("you did it!");

                                for (const detailCard of detailCards.uiInfo) {

                                    console.log(detailCard)

                                    if (detailCard.isVisible == false) {
                                        detailCard.isVisible = true;
                                    } else {
                                        detailCard.isVisible = false;
                                    }

                                    for (const info of detailCards.metaInfo) {
                                        if (info.isVisible == false) {
                                            info.isVisible = true;
                                        } else {
                                            info.isVisible = false;
                                        }
                                    }

                                }
                            });
                            button1.verticalAlignment = 1;
                            button1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                            advancedTexture.addControl(button1);

                            let button2 = GUI.Button.CreateSimpleButton("but2", "Image");
                            button2.width = 0.45;
                            button2.height = "200px";
                            button2.color = "white";
                            button2.fontSize = 100;
                            button2.background = "green";
                            button2.paddingTop = "1%";
                            button2.paddingBottom = "5%";
                            //button2.paddingLeft = 10;
                            button2.paddingRight = "10%";
                            button2.onPointerUpObservable.add(function () {

                                if (SVImage.isVisible == false) {
                                    SVImage.isVisible = true;
                                } else {
                                    SVImage.isVisible = false;
                                }

                            });
                            button2.verticalAlignment = 1;
                            button2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                            advancedTexture.addControl(button2);

                            card.isVisible = false;
                            plane.isVisible = false;
                            title.isVisible = false;
                            date.isVisible = false;
                            note.isVisible = false;
                            panel.isVisible = false;
                            button1.isVisible = false;
                            button2.isVisible = false;

                            return [card, plane, title, date, note, panel, button1, button2];
                            //return [card,title,date,panel,button1];


                        }

                        const showCards = makeCard(datum.item, datum.itemDetail, datum.positionObject, detailCardPosition)
                        data_list.push(showCards)
                    }


                    var buttonInfo = MeshBuilder.CreateCylinder("button_4", { radius: 0.5, height: 0.2 }, scene)

                    //buttonInfo.position.y = metaData.buttonPosition.y;
                    buttonInfo.position.y = objectPosition.y + metaData.buttonPosition.y;
                    buttonInfo.position.x = objectPosition.x + metaData.buttonPosition.x;
                    buttonInfo.position.z = objectPosition.z + metaData.buttonPosition.z;
                    buttonInfo.scaling.y = 0.05;
                    buttonInfo.scaling.x = 0.05;
                    buttonInfo.scaling.z = 0.05;
                    buttonInfo.rotation.y = Math.PI / 1;
                    buttonInfo.rotation.x = Math.PI / -2;
                    buttonInfo.rotation.z = Math.PI / 1;
                    buttonInfo.setParent(mesh)

                    buttonInfo.material = new StandardMaterial("mat_buttonInfo", scene);
                    buttonInfo.material.diffuseTexture = new BABYLON.Texture("./textures/info.png");
                    //buttonInfo.material.diffuseTexture = new BABYLON.Texture("https://jo-fil-ho.com/babylonJS/info.png");

                    // add actionManager on each cyl
                    buttonInfo.actionManager = new ActionManager(scene);
                    // register 'pickCylinder' as the handler function for cylinder picking action.
                    buttonInfo.actionManager.registerAction(
                        new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {

                            for (const data of data_list) {
                                for (const showCard of data) {
                                    if (showCard.isVisible == false) {
                                        showCard.isVisible = true;
                                        data[1].position.z = -0.12;
                                    } else {
                                        showCard.isVisible = false;
                                        data[1].position.z = -0.11;
                                    }
                                }
                            }
                        })
                    );
                    listButtons.push(buttonInfo)

                    // Pick Up Object
                    mesh.actionManager = new ActionManager(scene);
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, function (ev) {
                        //mesh.material = green;
                        //mesh.diffFromCamera = camera.position.subtract(pickup.position);
                        //mesh.log(pickup.diffFromCamera)
                        //mesh.position.y = 2;
                        //mesh.isCarried = true;
                        //mesh.physicsImpostor.setParam("mass", 0);
                        elm_meshName.textContent = meshName;
                        console.log(anno_list)
                        elm_annotation.textContent = anno_list;
                        console.log(data_list)
                        elm_metadata.textContent = data_list;
                        console.log(listTextDatas)
                        elm_text.textContent = listTextDatas;

                    }));
                }
            });
        resolveArray.push(resolve);
    };


    // モデルがすべて読みこみ終わった場合に実行する

    Promise.all(resolveArray).then(() => {
        
        //信憑性に基づく色付けをセレクトボックスで行う！
        for (const mesh of listMeshes) {
            console.log(mesh)
            console.log(mesh.meshOrig)
            const meshMaterial = new StandardMaterial("material", scene);
            const origMaterial = mesh.meshScene.material;
            //console.log(origMaterial)

            const typeA = function (isChecked) {
                if (isChecked) {
                    if (mesh.meshOrig.type === "A") {
                        meshMaterial.diffuseColor = new Color3(255, 0, 0);
                        meshMaterial.alpha = 0.5;
                        mesh.meshScene.material = meshMaterial;
                    } else {
                        ;
                    };
                }
                else {
                    if (mesh.meshOrig.type === "A") {
                        mesh.meshScene.material = origMaterial;
                    };
                }
            }

            const typeB = function (isChecked) {
                if (isChecked) {
                    if (mesh.meshOrig.type === "B") {
                        meshMaterial.diffuseColor = new Color3(0, 255, 0);
                        meshMaterial.alpha = 0.5;
                        mesh.meshScene.material = meshMaterial;
                    } else {
                        ;
                    };
                }
                else {
                    if (mesh.meshOrig.type === "B") {
                        mesh.meshScene.material = origMaterial;
                    };
                }
            }

            const typeC = function (isChecked) {
                if (isChecked) {
                    if (mesh.meshOrig.type === "C") {
                        meshMaterial.diffuseColor = new Color3(255, 255, 0);
                        meshMaterial.alpha = 0.5;
                        mesh.meshScene.material = meshMaterial;
                    } else {
                        ;
                    };
                }
                else {
                    if (mesh.meshOrig.type === "C") {
                        mesh.meshScene.material = origMaterial;
                    };
                }
            }

            var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

            var selectBox = new GUI.SelectionPanel("sp");
            selectBox.width = 0.15;
            selectBox.height = 0.18;
            selectBox.paddingLeft = "1%";
            selectBox.paddingTop = "1%";
            //selectBox.background = "#FFFF99";
            selectBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            selectBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

            advancedTexture.addControl(selectBox);

            var transformGroup = new GUI.CheckboxGroup("Certainty");
            transformGroup.addCheckbox("typeA", typeA);
            transformGroup.addCheckbox("typeB", typeB);
            transformGroup.addCheckbox("typeC", typeC);

            selectBox.addGroup(transformGroup);
        };

        for (const button of listButtons) {
            console.log(button)
            //button.setEnabled(false)

            var setColor = function (but) {
                switch (but) {
                    case 0:
                        console.log("show buttons");
                        button.setEnabled(true)
                        break
                    case 1:
                        console.log("hide buttons");
                        button.setEnabled(false)
                        break
                }
            }

            var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

            var selectBox = new GUI.SelectionPanel("sp");
            selectBox.width = 0.3;
            selectBox.height = 0.18;
            selectBox.paddingLeft = "15%";
            selectBox.paddingTop = "1%";
            //selectBox.background = "#FFFF99";
            selectBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            selectBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

            advancedTexture.addControl(selectBox);

            var colorGroup = new GUI.RadioGroup("Buttons");
            colorGroup.addRadio("show", setColor, true);
            colorGroup.addRadio("hide", setColor);

            selectBox.addGroup(colorGroup);
        };
    }).catch((error) => {
        console.log("エラーが出ているようです：" + error);
    });


    console.log(listMeshes)

    //var anchor = new AbstractMesh("anchor", scene);

    // Create the 3D UI manager
    //var manager = new GUI.GUI3DManager(scene);

    //var advancedTexture = new AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var advancedTexture = new AdvancedDynamicTexture("UI",128,128,scene);


    
    // テクスチャ生成(prefix を指定すれば自動で6枚読んでくれる)
    const skyTexture = new BABYLON.CubeTexture("https://www.babylonjs-playground.com/textures/skybox", scene);

    // マテリアル生成
    const skyMaterial = new StandardMaterial("cube_mat", scene);
    skyMaterial.reflectionTexture = skyTexture;
    skyMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE; // テクスチャを skybox 用にする
    skyMaterial.disableLighting = true; // ライティングを無視する
    skyMaterial.backFaceCulling = false; // 背面も表示する

    // メッシュ生成
    const skyMesh = MeshBuilder.CreateBox("cube_mesh", { size: 1000 }, scene);
    skyMesh.infiniteDistance = true; // カメラからの距離に依存しないメッシュとみなす
    skyMesh.material = skyMaterial;
    

    const ground = MeshBuilder.CreateGround("ground", { width: 500, height: 500 });

    // webXRの場合はこちら
    //var defaultXRExperience = scene.createDefaultXRExperienceAsync({
        //xrInput: defaultXRExperience.input,  
        //floorMeshes: [ground] //Array of meshes to be used as landing points 
        //floorMeshes: [ground, listMeshes]
    //});
    // defaultXRExperience.teleportation.addFloorMesh(ground);
    // defaultXRExperience.pointerSelection.attach();

    
    //const featuresManager = defaultXRExperience.baseExperience.featuresManager;
    //const handTracking = featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
        //xrInput: defaultXRExperienc.input
    //});


    // GUI
    //const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Style
    var style = advancedTexture.createStyle();
    style.fontSize = 24;
    style.fontStyle = "bold";

    return scene;

    
    //const xrPromise = scene.createDefaultXRExperienceAsync({
    //   floorMeshes: [ground]
    //});
    //return xrPromise.then((xrExperience) => {
    //    console.log("Done, WebXR is enabled.");
    //    return scene;
    //});
    
    engine.runRenderLoop(() => {
        scene.render();
      });
};


export { createScene };