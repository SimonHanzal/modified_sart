	/* METADATA */
	
	var timeline = [];
	var no_trials = 4;

    /* WELCOME */
    
	var welcome = {
      type: "html-keyboard-response",
      stimulus: '<div style = "font-size:22px;">You are now going to start a trial session for the experiment. Click this text, then press any key to begin.</div>'
    };
    timeline.push(welcome);

    /* INSTRUCTIONS */
    
	var instructions = {
      type: "html-keyboard-response",
      stimulus: '<div style = "font-size:22px;"><strong>Instructions:</strong></div>' +
				"<br>" +
				'<div style = "font-size:19px;">If the number is <strong>3</strong>, do not press anything.</div>' +
				"<br>" +
				'<div style = "font-size:19px;">If it is any other number between <strong>1-2</strong> or <strong>4-9</strong>, press the <strong>Space Bar</strong> as fast as you can.</div>' +
				"<br>" +
				'<div style = "font-size:19px;"> Make sure the experiment is open in an active window, displayed in the center and you are using a computer. </div>'+
				"<br>" +
				'<div style = "font-size:19px;">Please, also ensure your keyboard is connected to the computer and that there are no distractions around you.</div>' +
				"<br>" +	
				'<div style = "font-size:19px;">Press any key to begin the trial session.</div>',
      post_trial_gap: 2000
    };
    timeline.push(instructions);

    /* TRIALS */
	
	var test_stimuli = [
	  { stimulus: '<div style="font-size:64px;">1</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">2</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">3</div>', data: { test_part: 'test', correct_response: 'None'}  },
//	  { stimulus: '<div style="font-size:64px;">3</div>', data: { test_part: 'test', correct_response: 'None', font_size: '64'   } },
	  { stimulus: '<div style="font-size:64px;">4</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">5</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">6</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">7</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">8</div>', data: { test_part: 'test', correct_response: 'Space'} },
	  { stimulus: '<div style="font-size:64px;">9</div>', data: { test_part: 'test', correct_response: 'Space'} }
    ];

    var fixation = {
      type: 'html-keyboard-response',
      stimulus: "<p></p>",//'<div style="font-size:60px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: 15,
      data: {test_part: 'fixation'}
    }

    var test = {
      type: "html-keyboard-response",
      stimulus: jsPsych.timelineVariable('stimulus'),
      choices: ['f1','Space'],
	  stimulus_duration: 250,
	  trial_duration: 1135,
	  response_ends_trial: false,
      data: jsPsych.timelineVariable('data'),
	  on_finish: function(data){
		data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
		data.three = data.stimulus == '<div style="font-size:64px;">3</div>';
		if(data.correct == true){
		  data.type = 1;
		} else {
		  data.type = 0;
	       };
		if(data.stimulus == '<div style="font-size:64px;">3</div>'){
		  data.go = 3;
		} else {
		  data.go = 2;
	       }
	},
    }

    var test_procedure = {
      timeline: [fixation, test],
      timeline_variables: test_stimuli,
      repetitions: no_trials,
	  randomize_order: true
    }
	timeline.push(test_procedure);
	
	var debrief_block = {
	    type: "html-keyboard-response",
	    stimulus: function() {
			
		/* BASIC NUMBER CALCULATIONS */
		
		var trials = jsPsych.data.get().filter({test_part: 'test'});
		var correct_trials = trials.filter({correct: true});
		var correct_relevant = correct_trials.filter({three: true});
		var go_trials = trials.filter({three: false});
		var correct_go_trials = correct_trials.filter({three: false});

		var correct_no_go_p = correct_relevant.count();
		var incorrect_no_go_p = no_trials * 1 - correct_relevant.count();
		var correct_go_p = correct_trials.count() - correct_no_go_p;
		var incorrect_go_p = no_trials * 8 - correct_go_p;
		
		/* ANALYTIC CALCULATIONS */
		
		var accuracy_p = Math.round(correct_trials.count() / trials.count() * 10000) / 100;
		var accuracy_go = Math.round(correct_go_p / (correct_go_p + incorrect_go_p) * 10000) / 100;
		var accuracy_nogo = Math.round(correct_no_go_p / (correct_no_go_p + incorrect_no_go_p) * 10000) / 100;
		
		var minimum_p = Math.round(correct_go_trials.select('rt').min());
		var maximum_p = Math.round(correct_go_trials.select('rt').max());
		
		function roundme(value) {
		return Math.round(value);
		}
		
		var trial_data1 = Object.entries(correct_go_trials.select('rt'));
		var trial_data2 = trial_data1.slice(0,1).toString();
		var trial_data3 = trial_data2.split(",");
		var trial_data4 = trial_data3.slice(1);
		var trial_data5 = trial_data4.map(roundme);
		var trial_data_p = trial_data5.join(";");
		
		var trial_value1 = Object.entries(trials.select('type'));
		var trial_value2 = trial_value1.slice(0,1).toString();
		var trial_value3 = trial_value2.split(",");
		var trial_value4 = trial_value3.slice(1);
		var trial_value_p = trial_value4.join(";");
		
		var trial_go1 = Object.entries(trials.select('go'));
		var trial_go2 = trial_go1.slice(0,1).toString();
		var trial_go3 = trial_go2.split(",");
		var trial_go4 = trial_go3.slice(1);
		var trial_go_p = trial_go4.join(";");
		
		var true_rt_p = Math.round(correct_go_trials.select('rt').mean()*100)/100;

		function fc(value) {
		const mean = true_rt_p
		return Math.pow((value - true_rt_p), 2);
		}
		
		
		var sd1 = trial_data4.map(fc);
		var sd2 = sd1.reduce((a,b) => a + b, 0);
		var sd3 = sd2/sd1.length;
		var sd4 = Math.sqrt(sd3);
		var deviation_p = Math.round(sd4*100)/100;
			
			return  '<div style = "font-size:22px;">Congratulations, you have finished the trial session!</div>'+
					"<br>" +
					'<div style = "font-size:19px;">Please, check if you got the expected responses:</div>'+
					"<br>" +
					'<div style = "font-size:19px;">You missed '+incorrect_go_p+' of the numbers (1, 2, 4, 5, 6, 7, 8, 9) and incorrectly reacted  '+incorrect_no_go_p+'x  to number 3.</div>'+
					"<br>" +
					'<div style = "font-size:19px;"> Your accuracy when you were supposed to press the spacebar was '+accuracy_go+'% and when you were supposed not to press anything was '+accuracy_nogo+'%. </div>'+
					"<br>" +
					'<div style = "font-size:19px;"> <b> To receive a payment you must consistently show at least some correct responses to all of the numbers. </b> </div>'+
					"<br>" +
					'<div style = "font-size:19px;">Now, press any key to continue to the recorded part of the experiment.</div>';
		}
	};
	timeline.push(debrief_block);
