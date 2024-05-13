document.addEventListener('DOMContentLoaded', function () {
    let webcamElement = document.querySelector('#webcam');
    let canvasElement = document.createElement('canvas');
    document.body.appendChild(canvasElement);  
    let webcam = new Webcam(webcamElement, 'user', canvasElement);
    let resultElement = document.getElementById('result');
    let net;

    webcam.start()
        .then(result => {
            console.log("Webcam started");
        })
        .catch(err => {
            console.error("Error starting webcam:", err);
        });

    async function loadModel() {
        net = await ml5.imageClassifier('MobileNet', () => {
            console.log("Model loaded!");
        });
        document.querySelector('#take-photo').addEventListener('click', classifyImage);
    }

    async function classifyImage() {
        console.log("Taking photo...");
        webcam.snap();  
        let image = canvasElement;  
        image.style.position = "absolute";  
        image.style.left = "50%";  
        image.style.transform = "translate(-50%, -50%)";  
        image.style.borderRadius = "20px";
        
        try {
            const results = await net.classify(image);
            console.log("Classification results:", results);
            resultElement.innerHTML = results.map(result =>
                `<div>${result.label}: ${result.confidence.toFixed(3)}</div>`
            ).join('');
            resultElement.style.color = "purple";
            resultElement.style.textAlign = "center";
            resultElement.style.marginTop = "10px";
            resultElement.style.marginBottom = "10px";
        } catch (error) {
            console.error("Error during classification:", error);
        }
    }

    loadModel();

    window.addEventListener('resize', function() {
        updateImagePosition(); 
    });

    function updateImagePosition() {
        let image = canvasElement;
        if (window.innerWidth <= 680) {
            image.style.top = "95vh"; 
        } else {
           
            image.style.top = "95vh"; 
        }
    }

    updateImagePosition();

    setTimeout(updateImagePosition, 100); 
});
