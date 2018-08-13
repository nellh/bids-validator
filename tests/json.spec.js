var assert   = require('assert');
var validate = require('../index');

describe('JSON', function(){

	var file = {
		name: 'task-rest_bold.json',
		relativePath: '/task-rest_bold.json'
	};

	it('should catch missing closing brackets', function(){
		validate.JSON(file, '{', function (issues) {
			assert(issues && issues.length > 0);
		});
	});

	it('sidecars should have key/value pair for "RepetitionTime" expressed in seconds', function(){
		var jsonObj = '{"RepetitionTime": 1.2, "echo_time": 0.005, "flip_angle": 90, "TaskName": "Rest"}';
		validate.JSON(file, jsonObj, function (issues) {
			assert(issues.length === 0);
		});
		var jsonObjInval = '{"RepetitionTime": 1200, "echo_time": 0.005, "flip_angle": 90, "TaskName": "Rest"}';
		validate.JSON(file, jsonObjInval, function (issues) {
			assert(issues && issues.length === 1);
		});
	});

	it('should detect negative value for SliceTiming', function(){
		var jsonObj = '{"RepetitionTime": 1.2, "SliceTiming": [-1.0, 0.0, 1.0], "TaskName": "Rest"}';
		validate.JSON(file, jsonObj, function (issues) {
			assert(issues.length === 1 && issues[0].code == 55);
		});
	});

  var meg_file = {
      name: 'sub-01_run-01_meg.json',
      relativePath: '/sub-01_run-01_meg.json'
  };

  it('*_meg.json sidecars should have required key/value pairs', function(){
      var jsonObj = '{"TaskName": "Audiovis", "SamplingFrequency": 1000, ' +
                    ' "PowerLineFrequency": 50, "DewarPosition": "Upright", ' +
                    ' "SoftwareFilters": "n/a", "DigitizedLandmarks": true,' +
                    ' "DigitizedHeadPoints": false}';
      validate.JSON(meg_file, jsonObj, function (issues) {
          assert(issues.length === 0);
      });

      var jsonObjInval = jsonObj.replace(/"SamplingFrequency": 1000, /g, '');
      validate.JSON(meg_file, jsonObjInval, function(issues){
          assert(issues && issues.length === 1);
      });
  });

    const eeg_file = {
        name: 'sub-01_run-01_eeg.json',
        relativePath: '/sub-01_run-01_eeg.json',
        path: 'sub-01_run-01_eeg.json'
    };

    it('*_eeg.json sidecars should have required key/value pairs', function () {
        const jsonObj = '{"TaskName": "Audiovis", "Manufacturer": "TDT", ' +
            ' "EEGChannelCount": 128, "EOGChannelCount": 2, ' +
            ' "ECGChannelCount": 1, "EMGChannelCount": 2, ' +
            ' "PowerLineFrequency": 50, "SamplingFrequency": 10, "EEGReference": "reference"}';
        validate.JSON(eeg_file, jsonObj, function (issues) {
            assert(issues.length === 0);
        });

        const jsonObjInval = jsonObj.replace(/"EEGChannelCount": 128, /g, '');
        validate.JSON(eeg_file, jsonObjInval, function (issues) {
            assert(issues && issues.length === 1);
        });
    });
});
