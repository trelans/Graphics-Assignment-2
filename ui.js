document.addEventListener("DOMContentLoaded", function () {
    const timelineContainer = document.getElementById("timeline-container");
    const rulerContainer = document.getElementById("ruler");
    let markerCount = 0;
    let currentLastMarker = 0;

    function addMarker() {
        const marker = document.createElement("div");
        marker.className = "timeline-marker";

        const flexContainer = document.createElement("div");
        flexContainer.style.display = "flex";
        flexContainer.style.justifyContent = "space-between";

        // Texts to be centered using flex
        const texts = [markerCount, "'", "|", "'"]; // Include any additional texts here

        texts.forEach(text => {
            const textElement = document.createElement("div");
            textElement.textContent = text;
            textElement.style.width = "50%";
            textElement.style.textAlign = "start";
            flexContainer.appendChild(textElement);
        });

        marker.appendChild(flexContainer);

        rulerContainer.appendChild(marker);
        markerCount++;
    }



    for (let i = 0; i < 10; i++) {
        addMarker();
        currentLastMarker++;
    }

    timelineContainer.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
            if (currentLastMarker >= markerCount) {
                addMarker();
            } else {
                currentLastMarker++;
                timelineContainer.scrollLeft = (currentLastMarker - 10) * (timelineContainer.offsetWidth / 10);
            }
        } else if (event.deltaY > 0) {
            if (currentLastMarker > 10) {
                currentLastMarker--;
            }
            timelineContainer.scrollLeft = (currentLastMarker - 10) * (timelineContainer.offsetWidth / 10);
        }

        event.preventDefault();
    });


    const timeline = document.getElementById("timeline-container");

    let currentDraggedPoint = null;
    let isDragging = false;
    const pointTimePositions = []; // Array to store the positions of slider points
    let nextSliderId = 0; // ID of the next slider point to be created
    let currentSelectedPoint = null; // ID of the currently selected slider point

    // Function to create or select the existing slider point
    function createOrSelectSliderPoint(position, normalizedPosition) {
        const existingPoints = document.querySelectorAll('.slider-point');

        // Check if there is an existing slider point at the clicked position
        let existingPoint = null;
        existingPoints.forEach(point => {
            const pointPosition = point.getBoundingClientRect().left - timeline.getBoundingClientRect().left;
            if (Math.abs(pointPosition - position) < 15) {
                existingPoint = point;
            }
        });

        let currentSmallestTime = currentLastMarker - 10;
        position += currentSmallestTime * (timeline.getBoundingClientRect().width / 10);
        let pointTime = currentSmallestTime + normalizedPosition / 10;
        const selectedPoint = document.querySelector('.slider-point[style*="background-color: red"]');
        if (selectedPoint) {
            selectedPoint.style.backgroundColor = "#007BFF";
        }

        if (existingPoint) {
            // If a point exists, select it
            existingPoint.style.backgroundColor = "red";
            currentSelectedPoint = existingPoint.id.split("_")[1];
        } else {
            // If no point exists, create a new one
            const sliderPoint = document.createElement("div");
            sliderPoint.className = "slider-point";
            sliderPoint.style.left = position + "px";
            sliderPoint.style.backgroundColor = "red";
            sliderPoint.id = `point_${nextSliderId}`; // Assign the ID
            pointTimePositions.push({ id: nextSliderId, pointTime }); // Add new point to the positions array
            currentSelectedPoint = nextSliderId;
            nextSliderId++;
            sliderPoint.addEventListener("mousedown", function (event) {
                currentDraggedPoint = sliderPoint;
                isDragging = true;
                const offset = event.clientX - sliderPoint.getBoundingClientRect().left;

                window.addEventListener("mousemove", dragSliderPoint);
                window.addEventListener("mouseup", stopDragging);

                function dragSliderPoint(event) {
                    let newPosition = event.clientX - timeline.getBoundingClientRect().left - offset;
                    if (newPosition >= 0 && newPosition <= timeline.offsetWidth - sliderPoint.offsetWidth) {
                        newPosition += currentSmallestTime * (timeline.getBoundingClientRect().width / 10);
                        sliderPoint.style.left = newPosition + "px";
                        const normalizedPosition = calculateNormalizedPosition(newPosition);
                        const uniqueID = parseInt(sliderPoint.id.split("_")[1]);
                        const index = pointTimePositions.findIndex(point => point.id === uniqueID);
                        if (index !== -1) {
                            pointTimePositions[index].pointTime = currentSmallestTime + normalizedPosition / 10;
                        }
                    }
                }

                function stopDragging() {
                    currentDraggedPoint = null;
                    isDragging = false;
                    window.removeEventListener("mousemove", dragSliderPoint);
                    window.removeEventListener("mouseup", stopDragging);
                }
            });

            sliderPoint.addEventListener("dblclick", function () {
                if (!isDragging) {
                    // Remove the point from the array by ID
                    const uniqueID = parseInt(sliderPoint.id.split("_")[1]);
                    const index = pointTimePositions.findIndex(point => point.id === uniqueID);
                    if (index !== -1) {
                        pointTimePositions.splice(index, 1);
                    }
                    timelineContainer.removeChild(sliderPoint);
                }
            });

            timelineContainer.appendChild(sliderPoint);
        }
    }

    function calculateNormalizedPosition(position) {
        const timelineWidth = timeline.getBoundingClientRect().width;
        const normalizedPosition = position / timelineWidth * 100;
        return Math.round(normalizedPosition);
    }

    // Add an event listener to create or select slider points on timeline click
    timeline.addEventListener("click", function (event) {
        const position = event.clientX - timeline.getBoundingClientRect().left;
        const normalizedPosition = calculateNormalizedPosition(position);
        console.log(position);
        console.log(normalizedPosition);
        console.log(timeline.getBoundingClientRect().width);
        createOrSelectSliderPoint(position, normalizedPosition);
        console.log(pointTimePositions);
    });
});