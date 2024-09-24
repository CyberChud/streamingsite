// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'your-region'; // Region of your S3 bucket
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-2:db73b458-1f18-4201-b105-4339d29caf3a', // Your Identity Pool ID
});

// Create S3 service object
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: 'zzvideo-media' } // Your S3 Bucket name
});

// Function to fetch and display the video list
function listVideos() {
  s3.listObjectsV2({ Prefix: '' }, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      var videoList = document.getElementById('video-list');
      data.Contents.forEach(function (video) {
        var videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerText = video.Key;
        videoItem.onclick = function () {
          playVideo(video.Key);
        };
        videoList.appendChild(videoItem);
      });
    }
  });
}

// Function to generate signed URL and play the video
function playVideo(videoKey) {
  var params = { Bucket: 'zzvideo-media', Key: videoKey };
  s3.getSignedUrl('getObject', params, function (err, url) {
    if (err) {
      console.log("Error", err);
    } else {
      var videoSource = document.getElementById('video-source');
      videoSource.src = url;
      document.getElementById('player').load();
    }
  });
}

// Load video list on page load
window.onload = listVideos;
