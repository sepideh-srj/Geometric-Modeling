Load an OBJ file from Prof. Richard webpage first to see the model in canvas.
All of the features are implemented. 

Part 1)
The control options and the mesh display options are implemented and placed below the canvas.
Saving the model with desired name as a OBJ file is also provided.

Part2)
The code will write the OBJ file as indices and positions and gives it to the buffers for rendering.
createWingedEdge function is executed to store the object in winged-edge data structure.
renderWingedEdge is also executed which will transform the winged-edge data structure of the object to OBJ and also computes the normals for flat shading and smooth shading in makeNormals function.


