// Load the Visualization API and the chart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
	  // We are calling RequestData to do the initial data load.
      google.setOnLoadCallback(RequestData);
	
	//This function should be the first to be called whenever
	//data is refreshed. It sends the request to the web service.
	function RequestData() {
	  
	//Code snippet from w3c schools, handles different browsers correctly.
		var xmlhttp = null;
		
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else {
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		//Sets up callback to handle response.
		//This only executes once the server has a response.
		xmlhttp.onreadystatechange = function() {
		  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			//JSON.parse is more secure than eval as no scripts will run. May not be supported in all browsers though.
			debugger;
			document.getElementById('chart_div').innerHTML = JSON.eval(xmlhttp.responseText);
			//var returndata = JSON.eval(xmlhttp.responseText);
			//LoadData(returndata);
		  } else {
			// wait for the call to complete
		  }
		};
		
		//Sends the request.
		xmlhttp.open('GET','/VibrationDiagnosisWebData/ViewAnalysisResults',true);
		xmlhttp.send(null);
	}
	  
	//This function takes the return data of our webservice and
	//draws the chart on the page.
	function LoadData(WebServiceData) {
		//Convert data to the correct format (in this case for a single waveform
		var data = LVWaveformtoGoogleDataTable(WebServiceData.DataWaveform);
	  
	    // Set chart options
        var options = {'title':'tytul',};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
	}
	  
	//This function takes a LVWaveform object and converts it to a data table
	//for use with the google API.  It creates a full time column and a data
	//column.
	function LVWaveformtoGoogleDataTable(LVWaveform){
		// Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Time');
        data.addColumn('number', 'Temperature');
		
		//Set up variables we need in for loop
		var next_time = new Date(LVWaveform.t0);
		var dt_ms = LVWaveform.dt*1000;
		
		//Add each row to the data table.
		for(i=0; i<LVWaveform.Y.length;i++)
		{
			//We muse use new Date here to effectively pass by value.
			data.addRow([new Date(next_time),LVWaveform.Y[i]]);
			next_time.setTime(next_time.getTime()+dt_ms);
		}
	return data;
	}
	  