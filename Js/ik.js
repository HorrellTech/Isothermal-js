/*
  This is my Inverse Kinematics engine.
  
  This can make for some interesting dynamic animations like
  in the game Rain World
*/
this.ik = function(){
  
  /*
    The Inverse Kinematic parent object.
    
    This holds an array of joints 
  */
  class IK {
    constructor (x = 0, y = 0){
      this.joints = [];
      this.x = x;
      this.y = y;
      this.toX = 0;
      this.toY = 0;
      this.static = true;
    }
    
    // Set the position of the IK object
    setPosition(x, y)
    {
      this.x = x;
      this.y = y;
    }
    
    // Add a joint to the list 
    jointAdd(length, direction) {
      let j = this.joints.push(new Joint(this.x, this.y, length, direction));
      
      return (j);
    }
    
    // Set the target location for the end joint to try move towards
    setTarget(x, y)
    {
      this.toX = x;
      this.toY = y;
    }
    
    // Return the joint at the given index in the array
    jointGet(index)
    {
      return (this.joints[index]);
    }
    
    // Return the last joint, this is the joint that will find locations
    jointGetLast()
    {
      return (this.joints[this.joints.length - 1]);
    }
    
    // Return the first joint, this is the joint at the base
    jointGetFirst()
    {
      return (this.joints[0]);
    }
    
    // Update all of the joints inverse kinematics
    update() {
      if(this.joints.length > 0) {
        
        for(let j = this.joints.length - 1; j >= 0; j--) {
            if(j == this.joints.length - 1) { // If the joint is the final one in the chain, then it follows the toX and toY
              this.joints[j].follow(this.toX, this.toY);
              if(j == 0){ // If the joint is the only one available
                if(this.static) // If the IK object is static, then we want the joint to stay bound to it
                {
                  this.joints[j].a.x = this.x;
                  this.joints[j].a.y = this.y;
                }
              }
            }
            else // Then if the joint is not the final one in the chain, we want to link the joint to the one in front of it
            {
              this.joints[j].follow(this.joints[j + 1].a.x, this.joints[j + 1].a.y);
              if(j == 0){ // If the joint is the first one available
                if(this.static) // If the IK object is static, then we want the joint to stay bound to it
                {
                  this.joints[j].a.x = this.x;
                  this.joints[j].a.y = this.y;
                }
              }
            }
          
          this.joints[j].update(); // update the joint
        }
        
        // Now iterate back through the joints starting from the first one 
        for(let i = 1; i < this.joints.length; i++)
        {
          this.joints[i].a.x = this.joints[i - 1].b.x;
          this.joints[i].a.y = this.joints[i - 1].b.y;
          
          this.joints[i].update();
        }
        
        
        // Lets check if the IK object is static, and if not, it should follow the first child joint
        if(!this.static)
        {
          this.x = this.joints[0].a.x;
          this.y = this.joints[0].a.y;
        }
      }
    }
    
    // Draw the joints. This is mainly for debugging
    drawDebug() {
      if(this.joints.length > 0) {
        for(let j = 0; j < this.joints.length; j++) {
          screen.setLineWidth(1 + this.joints.length - j);
          this.joints[j].drawDebug();
        }
      }
      screen.drawRound(this.x, this.y, 12, 12, "yellow");
      screen.setLineWidth(1);
    }
  }
  
  /*
    This is the class for the joints for the Inverse Kinematic engine
  */
  class Joint {
    constructor (x, y, length, direction, name = "joint") {
      this.a = new vec2(x, y);
      this.b = new vec2(0, 0);
      
      this.name = name;
      
      this.length = length;
      this.direction = direction;
      
      this.force = 0; // The amount of force to apply to this joint
      this.forceDirection = 0; // The direction to apply force
      
      this.calculateB();
    }
    
    calculateB() {
      let dx = this.length * Math.cos(this.direction);
      let dy = this.length * Math.sin(this.direction);
      this.b.set(this.a.x + dx, this.a.y + dy);
    }
    
    setForce(force, direction)
    {
      this.forceDirection = direction;
      this.force = force;
    }
    
    applyForce(force, direction)
    {
      let dx = force * Math.cos(direction);
      let dy = force * Math.sin(direction);
      
      if(force != 0) {
        this.follow(this.b.x + dx, this.b.y + dy);
      }
    }
    
    follow(tx, ty) {
     const target = new vec2(tx, ty);
     const dir = target.sub(this.a);
     this.direction = dir.heading();
     
     dir.setMagnitude(this.length);
     dir.multiply(-1);
     
     this.a = target.add(dir);
    }
    
    // Update function
    update() {
      if(this.force != 0)
      {
        this.applyForce(this.force, this.forceDirection);
      }
      
      
      this.calculateB();
    }
    
    // Use the basic drawing system to draw the joints
    drawDebug() {
      screen.drawLine(this.a.x, this.a.y, this.b.x, this.b.y, "red");
      screen.drawRound(this.a.x, this.a.y, 2, 2, "lime");
      screen.drawRound(this.b.x, this.b.y, 4, 4, "blue");
    }
  }  
  
  /*
    Vector 2D class for position handling etc
  */
  class vec2 {
    constructor (x = 0, y = 0)
    {
      this.x = x;
      this.y = y;
    }
    
    radToDeg(value) {
      return (value * 180 / Math.pi);
    }
    
    // Set the x and y positions of the vector
    set(x, y) {
      this.x = x;
      this.y = y;
    }
    
    // Add 2 vectors together and return the new vector
    add(v) {
	    return new vec2(this.x + v.x, this.y + v.y);
    }
    
    // Subtract one vector from another and return the new vector
    sub(v) {
	    return new vec2(this.x - v.x, this.y - v.y);
    }
    
    // Multiply the vector and return the new vector
    multiply(scaler) {
      this.x = this.x * scaler;
      this.y = this.y * scaler;
	    //return new vec2(v.x * scaler, v.y * scaler);
    }
    
    // Divide the vector and return the new vector
    divide(divider) {
      this.x = this.x / divider;
      this.y = this.y / divider;
	    //return new vec2(v.x / divider, v.y / divider);
    }
    
    // Inverse the vector and return the new vector
    inverse() {
      this.x = -this.x;
      this.y = -this.y;
	    //return new vec2(-v.x, -v.y);
    }
    
    // Returns the length of a vector
    magnitude() {
	    return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    
    setMagnitude(value)
    {
      const current = this.magnitude();
      
      if(current === 0) {
        this.x = 0;
        this.y = 0;
        return;
        //return (new vec2(0, 0));
      }
      
      const scaleFactor = value / current;
      
      this.x = this.x * scaleFactor;
      this.y = this.y * scaleFactor;
      //return (new vec2(v.x * scaleFactor, v.y * scaleFactor))
    }
    
    // Returns unit vector from a given vector
    normalize(v) {
	    var mag = this.magnitude();
	    return new vec2(v.x / mag, v.y / mag);
    }
    
    // Returns dot product of 2 given vectors
    dot(v1, v2) {
    	return (v1.x * v2.x) + (v1.y * v2.y);
    }
    
    // Returns cross product of two given vectors
    cross(v1, v2) {
    	return (v1.x * v2.y) - (v2.x * v1.y);
    }
    
    // Returns the distance from one vector to another
    distance(v1, v2) {
    	return Math.sqrt(((v1.x - v2.x) * (v1.x - v2.x)) + ((v1.y - v2.y) * (v1.y - v2.y)));
    }
    
    heading() {
      return (Math.atan2(this.y, this.x));
    }
    
    // Returns if one vector is equal to another
    isEqual(v1, v2)
    {
	    return (v1.x == v2.x) && (v1.y == v2.y);
    }
    
    // Clone this vector
    clone() {
        return new vec2(this.x, this.y);
    }
  }
  
  return new IK();
}
