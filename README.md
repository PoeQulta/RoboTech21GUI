# RoboTech 2021 GUI Web Interface
Our Software Team’s approach to designing our new Software Suite revolves around the idea of Compatibility.

The Top-side software is based on various web app APIs (Gamepad API and Chrome Sockets API,for example) which makes it not only cross-platform, but also requiring no (or minimal) additional dependencies that the average web-ready device doesn’t have.

The GUI includes a full telemetry system that manages ROV performance using Bottom-side sensor readings (Current draw, power converter temperature...etc) and also keeps track of ROV position and orientation, this allows for integration between the CV(computer vision) and IMU(inertial measurement unit) based PID control loops for more accurate autonomous movement.

