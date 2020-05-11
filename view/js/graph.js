window.onload = function () {
  
  var pointArr = new Array();
  var n = $(".skill").length;
  console.log(n);
  for(var i=0; i<n; i++)
  {
    var pointValue = new Object();
    pointValue.label = $(".skill").eq(i).text();
    pointValue.y = parseInt($(".percentage").eq(i).text());
    pointArr.push(pointValue) ;
    
  }
  // console.log("pointValue:",pointValue);
  console.log("pointArr:",pointArr);
  var options = {
    animationEnabled: true,
    title: {
      text: "My Skill Gragh"
    },
    axisY: {
      title: " Rate",
      includeZero: false
    },
    axisX: {
      title: "Skills"
    },
    

    data: [{
      type: "column",
      yValueFormatString: "#,##0.0#"%"",
      dataPoints: pointArr
      
    }]
  };
  console.log("pointArr:",pointArr);
  $("#chartContainer").CanvasJSChart(options);
  
  }