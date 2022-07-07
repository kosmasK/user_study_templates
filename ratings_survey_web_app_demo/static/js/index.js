// Function for geting a random integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Function for shuffling an array
function arrShuffle(array, array2) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
  
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        [array2[currentIndex], array2[randomIndex]] = [array2[randomIndex], array2[currentIndex]];
    }
  
    return [array, array2];
}


// Function for sending post request to flask server with image data as a tensor
function sendDataToServer(sender, options){
    
    options.showDataSaving();
    console.log("sender: ", sender);


    // test_paths
    console.log("[SEND TO SERVER] test_paths: ", test_paths);

    dataJSON = {}

    // Get the answers
    dataJSON.answers = sender.data

    // Get the order of the questions
    dataJSON.survey = test_paths

    // Get the test number
    dataJSON.testN = t_idx
    
    $.ajax({
        type: "POST",
        url: "/postmethod",
        contentType: "application/json",
        data: JSON.stringify(dataJSON),
        dataType: "json",
        success: function(response) {
            console.log(response);
            options.showDataSavingSuccess();
        },
        error: function(err) {  
            console.log(err);
            options.showDataSavingError();
        }
    });
}

//  We apply our style to the survey
var defaultThemeColors = Survey.StylesManager.ThemeColors["default"];

// If you want to style your survey with different colors modify the following css classes

// defaultThemeColors["$header-background-color"]= "#d8e1e7"
// defaultThemeColors["$body-container-background-color"]= "#f6f7f2"
// defaultThemeColors["$main-color"]= "#3c4f6d"
// defaultThemeColors["$main-hover-color"]= "#2c3f5d"
// defaultThemeColors["$body-background-color"]= "white"
// defaultThemeColors["$inputs-background-color"]= "white"
// defaultThemeColors["$text-color"]= "#4a4a4a"
// defaultThemeColors["$text-input-color"]= "#4a4a4a"
// defaultThemeColors["$header-color"]= "#6d7072"
// defaultThemeColors["$border-color"]= "#e7e7e7"
// defaultThemeColors["$error-color"]= "#ed5565"
// defaultThemeColors["$error-background-color"]= "#fd6575"
// defaultThemeColors["$progress-text-color"]= "#9d9d9d"
// defaultThemeColors["$disable-color"]= "#dbdbdb"
// defaultThemeColors["$disabled-label-color"]= "rgba(64, 64, 64, 0.5)"
// defaultThemeColors["$slider-color"]= "white",
// defaultThemeColors["$disabled-switch-color"]= "#9f9f9f"
// defaultThemeColors["$disabled-slider-color"]= "#cfcfcf"
// defaultThemeColors["$foreground-light"]= "#909090"
// defaultThemeColors["$foreground-disabled"]= "#161616"
// defaultThemeColors["$background-dim"]= "#f3f3f3";
// defaultThemeColors["$progress-buttons-color"]= "#3C4F6D";
// defaultThemeColors["$progress-buttons-line-color"]= "#3C4F6D";

Survey.StylesManager.applyTheme(); 


// We declare the main structure of the survey allong with the first page 
// + demographics questions 
// + final feedback page
var defsurveyJSON = {
    title: " Neural Speech Synthesis - TTS ",
    description: " Test for evaluating the performance of neural speech synthesis systems ",
    pages: [
        {
            name: "Intro",
            elements: [
                {
                    type: "html",
                    name: "Info",
                    html: "<p>The survey comprises 25 tests, where each test presents an audio clip of speech with duration up to 10 seconds.\n</p>\n\n<p>Then the evaluator is required to rate the speech naturalness of the given audio clip in a likert scale between 1-5, with 1 indicating \"non-speech\" and 5 completely \"natural speech\" .\n</p>\n\n\n<br>\n<br>\n<br>\n============================\n<p>\n<strong>Required Browser:</strong> Firefox, Chrome, Safari\n</p>\n<p>\n<strong>Estimated time duration to complete the survey:</strong> 10 to 15 minutes\n</p>\n\n<p> <strong>For questions please contact:</strong> <a href=\"mailto:kosmas.kritsis@athenarc.gr\">kosmas.kritsis@athenarc.gr</a> \n</p>"
                }
            ],
            title: " Survey Info: "
        },
        {
            name: "Demographics",
            elements: [
                {
                    type: "radiogroup",
                    name: "question1",
                    title: "How old are you?",
                    isRequired: true,
                    choices: [
                        {
                            value: "item1",
                            text: "-20"
                        },
                        {
                            value: "item2",
                            text: "20-30"
                        }
                    ],
                    hasOther: false
                },
                {
                    type: "radiogroup",
                    name: "question2",
                    title: "What is your gender?",
                    isRequired: true,
                    choices: [
                        {
                            value: "item1",
                            text: "Male"
                        },
                        {
                            value: "item2",
                            text: "Female"
                        }
                    ],
                    hasOther: false
                },
                {
                    type: "rating",
                    name: "question3",
                    title: "Are you familiar with Machine Learning and Artificial Inteligence?",
                    isRequired: true,
                    minRateDescription: "Amateur",
                    maxRateDescription: "Expert"
                }
            ],
            title: " Demographics ",
            description: " Please answer the following demographic questions. "
        },
        {
            name: "Feedback",
            elements: [
                {
                    type: "comment",
                    name: "feedback",
                    title: "We would be glad to receive your feedback. (optional)",
                    hideNumber: true
                }
            ],
            title: "Feedback",
            description: ""
        }
    ],
    showQuestionNumbers: "onPage",
    showProgressBar: "bottom",
    firstPageIsStarted: true
};

// We declare the format of the page that includes each wav audio with the rating question
var defTestPage = {
    name: "Test ",
    questions: [
        {
            type: "html",
            name: "audio-",
            html: "test"
        },
        {
            type: "rating",
            name: "question1-",
            title: "Please rate the speech naturalness:",
            isRequired: true,
            rateMin: 1,
            rateMax: 5,
            rateStep: 0.5,
            minRateDescription: "Non-speech",
            maxRateDescription: "Completely natural"
        }
    ],
    title: "Test ",
    description: " Please listen the audio clip and answer the question."
};



// We declare which test we want to make as random choice for presenting to user
// Each test contains random ids corresponding to the wav files.
// tests_lst = [3,4,5] -> e.g. if we want to choose between test 3,4,5
// In total we have 6 tests
// var tests_lst = [0,1,2,3,4,5];
var tests_lst = [0,2,4,5];

// We declare the name of the models. Must match the name of the folders containing the generated wavs
var models = ['01_GT_LJS', '02_GT_WaveGlow']

// Variable to store all paths for the wavs of the random test
var test_paths = []
var test_wavs_html = []
var t_idx = -1


$.getJSON('static/js/tests.json', function(data) {
    //do stuff with your data here
    console.log("data:", data);
        
    // Random integer
    // var t_idx = getRndInteger(0,5)

    // Random element from a list
    t_idx = tests_lst[Math.floor(Math.random()*tests_lst.length)];
    console.log("Random test No: ",t_idx);

    
    for (let i=0;i<models.length;i++){
        console.log("Wavs for model ",models[i]);
        let model = models[i];

        console.log(data['array'][i][t_idx]);
        mod_t_wav = data['array'][i][t_idx];
        console.log(mod_t_wav)
        for (let j=0; j<mod_t_wav.length; j++){
            
            wav_path = model+'/'+mod_t_wav[j].toString()+'.wav'
            test_paths.push(wav_path);

            wav_html = `<audio controls><source src=\"${window.location.href}static/wavs/${wav_path}\" type=\"audio/wav\"> Your browser does not support the <code>audio</code> element. </audio>`
            test_wavs_html.push(wav_html)
        }
        
    }
    

    arrShuffle(test_paths, test_wavs_html);
    console.log(test_paths);
    console.log(test_wavs_html);

    let surveyJSON = JSON.parse(JSON.stringify(defsurveyJSON));

    for (let i=0; i< test_paths.length; i++){

        idxTest = i + 1;
        idxQ = idxTest

        testPage = JSON.parse(JSON.stringify(defTestPage));
        testPage.name = testPage.name + idxTest;
        testPage.title = testPage.title + idxTest;

        new_html = test_wavs_html[i];

        testPage.questions[0].html = new_html;
  
        testPage.questions[0].name = testPage.questions[0].name + idxQ;
        // idxQ++;
        testPage.questions[1].name = testPage.questions[1].name + idxQ;
        // idxQ++;
       
        new_page = JSON.parse(JSON.stringify(testPage));

        idxPush = i + 2
        surveyJSON.pages.splice(idxPush,0,new_page)

    }

    // Initialize survey
    var survey = new Survey.Model(surveyJSON);
    $("#surveyContainer").Survey({
        model: survey,
        onComplete: sendDataToServer.bind(this)
    });

});


