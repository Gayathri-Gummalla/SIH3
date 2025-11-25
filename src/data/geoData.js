// Simplified GeoJSON data for India states (coordinates are approximate)

export const indiaGeoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "Maharashtra", code: "MH" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [72.6369, 20.7514], [72.8479, 19.0748], [73.8567, 18.5204],
                    [74.7721, 18.9068], [76.2711, 19.0728], [77.4126, 19.6633],
                    [78.1389, 20.2639], [77.3152, 21.1458], [76.1300, 21.7679],
                    [74.7721, 21.1458], [73.3119, 20.7514], [72.6369, 20.7514]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Karnataka", code: "KA" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [74.1240, 15.3173], [74.8413, 14.5204], [75.7139, 13.9299],
                    [76.6444, 13.0827], [77.5946, 12.9716], [78.1389, 13.6288],
                    [77.5946, 14.5204], [76.6444, 15.3173], [75.7139, 16.0000],
                    [74.8413, 16.5000], [74.1240, 15.3173]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Tamil Nadu", code: "TN" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [76.7635, 11.1271], [77.5946, 10.7905], [78.6569, 10.7672],
                    [79.8083, 10.3573], [80.2707, 9.5586], [79.8613, 8.8932],
                    [78.0322, 8.8932], [77.0713, 9.9252], [76.7635, 11.1271]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Gujarat", code: "GJ" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [68.1628, 23.0225], [69.6449, 22.9676], [70.6369, 22.5726],
                    [71.1746, 21.8974], [72.0244, 21.1458], [72.8479, 21.5222],
                    [73.3119, 22.3039], [72.8479, 23.5880], [71.6293, 24.0776],
                    [70.0985, 23.8103], [68.1628, 23.0225]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Rajasthan", code: "RJ" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [69.6449, 27.0238], [70.6369, 26.3978], [72.0244, 26.3978],
                    [73.4119, 25.7706], [74.2354, 25.2551], [75.0589, 24.6291],
                    [76.1300, 24.8968], [76.8824, 25.8403], [76.8824, 27.0238],
                    [75.0589, 28.3949], [73.4119, 29.0320], [71.1746, 28.3949],
                    [69.6449, 27.0238]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Uttar Pradesh", code: "UP" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [77.0713, 30.3165], [78.6569, 29.9652], [80.2707, 29.0320],
                    [81.5252, 27.8406], [83.0549, 26.8446], [84.0469, 26.4451],
                    [84.6716, 25.8403], [83.8481, 25.2551], [82.1913, 25.0000],
                    [80.2707, 25.5993], [78.6569, 26.3978], [77.0713, 27.5706],
                    [76.1300, 28.6353], [77.0713, 30.3165]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "West Bengal", code: "WB" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [85.8245, 27.3314], [87.0790, 26.8446], [88.0710, 26.6316],
                    [88.9945, 26.4141], [89.8180, 26.2194], [89.8180, 25.2551],
                    [89.0656, 24.2334], [88.6032, 23.6345], [88.0710, 22.5726],
                    [87.5388, 21.8974], [86.9141, 21.5222], [85.8245, 22.3039],
                    [85.0721, 23.6345], [85.8245, 25.2551], [85.8245, 27.3314]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Madhya Pradesh", code: "MP" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [74.7721, 26.2194], [76.1300, 25.8403], [77.5946, 25.2551],
                    [79.0642, 24.6291], [80.2707, 24.0776], [81.5252, 23.5880],
                    [82.1913, 22.9676], [81.8835, 21.8974], [80.2707, 21.5222],
                    [78.6569, 21.8974], [77.0713, 22.5726], [75.4854, 22.9676],
                    [74.2354, 23.5880], [74.7721, 24.6291], [74.7721, 26.2194]
                ]]
            }
        }
    ]
};

// District boundaries for Maharashtra (simplified)
export const maharashtraDistrictsGeoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "Pune", code: "PU" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [73.5, 18.2], [74.2, 18.2], [74.7, 18.5],
                    [74.7, 19.2], [74.2, 19.5], [73.5, 19.2], [73.5, 18.2]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Mumbai", code: "MU" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [72.7, 18.9], [73.0, 18.9], [73.2, 19.2],
                    [73.0, 19.4], [72.7, 19.3], [72.7, 18.9]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Nagpur", code: "NG" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [78.8, 20.8], [79.3, 20.8], [79.5, 21.2],
                    [79.3, 21.5], [78.8, 21.4], [78.8, 20.8]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Nashik", code: "NS" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [73.5, 19.5], [74.2, 19.5], [74.5, 20.0],
                    [74.2, 20.5], [73.5, 20.3], [73.5, 19.5]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { name: "Aurangabad", code: "AU" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [75.0, 19.5], [75.5, 19.5], [75.8, 19.9],
                    [75.5, 20.2], [75.0, 20.1], [75.0, 19.5]
                ]]
            }
        }
    ]
};
