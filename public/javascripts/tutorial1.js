$(function() {
  // set the scene size
  var WIDTH = 500,
    HEIGHT = 300;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');


  var renderer = new THREE.WebGLRenderer();
  var camera = 
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);
  var scene = new THREE.Scene();

  // add the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 300;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DON element
  $container.append(renderer.domElement);

  // set up the sphere vars
  var radius = 50,
      segments = 6,
      rings = 16;

      // create the sphere's material
  var sphereMaterial =
    new THREE.MeshLambertMaterial(
      {
        color: 0xCCFF00
      });

  // create a new mesh with
  // sphere geometry - we will cover
  // the sphereMaterial next!
  var sphere = new THREE.Mesh(

    new THREE.SphereGeometry(
      radius,
      segments,
      rings),

    sphereMaterial);

  // add the sphere to the scene
  scene.add(sphere);

  // create a point light
  var pointLight =
    new THREE.PointLight(0x00FFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  // draw!
  renderer.render(scene, camera);

  // sphere geometry
  sphere.geometry

  // which contains the vertices and faces
  sphere.geometry.vertices // an array
  sphere.geometry.faces // also an array

  // its position
  sphere.position // contains x, y and z
  sphere.rotation // same
  sphere.scale // ... same

  // set the geometry to dynamic
  // so that it allow updates
  sphere.geometry.dynamic = true;

  // changes to the vertices
  sphere.geometry.verticesNeedUpdate = true;

  // changes to the normals
  sphere.geometry.normalsNeedUpdate = true;

THREE.DragControls = function(_camera, _objects, _domElement) {

 if (_objects instanceof THREE.Scene) {

_objects = _objects.children;

 }

 var _projector = new THREE.Projector();

 var _mouse = new THREE.Vector3(),

    _offset = new THREE.Vector3();

var _selected;

_domElement.addEventListener('mousemove', onDocumentMouseMove, false);

_domElement.addEventListener('mousedown', onDocumentMouseDown, false);

_domElement.addEventListener('mouseup', onDocumentMouseUp, false);


function onDocumentMouseMove(event) {

  event.preventDefault();

   _mouse.x = (event.clientX / _domElement.width) * 2 - 1;

   _mouse.y = -(event.clientY / _domElement.height) * 2 + 1;

    var ray = _projector.pickingRay(_mouse, _camera);

    if (_selected) {

         var targetPos = ray.direction.clone().multiplyScalar(_selected.distance).addSelf(ray.origin);

         _selected.object.position.copy(targetPos.subSelf(_offset));

        return;

   }


    var intersects = ray.intersectObjects(_objects);

    if (intersects.length > 0) {

       _domElement.style.cursor = 'pointer';

    } else {

        _domElement.style.cursor = 'auto';

    }

  }

   function onDocumentMouseDown(event) {

     event.preventDefault();

     _mouse.x = (event.clientX / _domElement.width) * 2 - 1;

     _mouse.y = -(event.clientY / _domElement.height) * 2 + 1;

     var ray = _projector.pickingRay(_mouse, _camera);

     var intersects = ray.intersectObjects(_objects);

     if (intersects.length > 0) {

         _selected = intersects[0];

         _offset.copy(_selected.point).subSelf(_selected.object.position);

         _domElement.style.cursor = 'move';
   }        
  }


  function onDocumentMouseUp(event) {

     event.preventDefault();

     if (_selected) {

         _selected = null;

    }

     _domElement.style.cursor = 'auto';

 }

  }
});