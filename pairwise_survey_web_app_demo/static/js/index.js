//  We apply our style to the survey
var defaultThemeColors = Survey.StylesManager.ThemeColors["default"];

// If you want to style your survey with different colors modify the following CSS classes 
// along with some CSS attributes included in static/css/style.css
defaultThemeColors["$header-background-color"]= "#d8e1e7"
defaultThemeColors["$body-container-background-color"]= "#f6f7f2"
defaultThemeColors["$main-color"]= "#3c4f6d"
defaultThemeColors["$main-hover-color"]= "#2c3f5d"
defaultThemeColors["$body-background-color"]= "white"
defaultThemeColors["$inputs-background-color"]= "white"
defaultThemeColors["$text-color"]= "#4a4a4a"
defaultThemeColors["$text-input-color"]= "#4a4a4a"
defaultThemeColors["$header-color"]= "#6d7072"
defaultThemeColors["$border-color"]= "#e7e7e7"
defaultThemeColors["$error-color"]= "#ed5565"
defaultThemeColors["$error-background-color"]= "#fd6575"
defaultThemeColors["$progress-text-color"]= "#9d9d9d"
defaultThemeColors["$disable-color"]= "#dbdbdb"
defaultThemeColors["$disabled-label-color"]= "rgba(64, 64, 64, 0.5)"
defaultThemeColors["$slider-color"]= "white",
defaultThemeColors["$disabled-switch-color"]= "#9f9f9f"
defaultThemeColors["$disabled-slider-color"]= "#cfcfcf"
defaultThemeColors["$foreground-light"]= "#909090"
defaultThemeColors["$foreground-disabled"]= "#161616"
defaultThemeColors["$background-dim"]= "#f3f3f3";
defaultThemeColors["$progress-buttons-color"]= "#3C4F6D";
defaultThemeColors["$progress-buttons-line-color"]= "#3C4F6D";

Survey.StylesManager.applyTheme();


// We declare the main structure of the survey allong with the first page 
// + demographics questions 
// + final feedback page

var defsurveyJSON = {
    title: " Automatic Dance Sequence Generation ",
    description: " Test for evaluating the performance of an autoregressive sequence generator ",
    pages: [
        {
            name: "Intro",
            elements: [
                {
                    type: "html",
                    name: "Info",
                    html: "<p>The survey comprises 20 tests, where each test presents two video clips of human pose sequences with duration of 10 seconds.\n</p>\n\n<p>Then the evaluator is required to select a video according to the motion realism of the skeletal poses, as well as choosing the dance video that matches better with the paired music.\n</p>\n\n\n<br>\n<br>\n<br>\n============================\n<p>\n<strong>Required Browser:</strong> Firefox, Chrome, Safari\n</p>\n<p>\n<strong>Estimated time duration to complete the survey:</strong> 10 to 15 minutes\n</p>\n\n<p>\n<strong>Hint:</strong> You can enable loop playback by right clicking on the video area and selecting the \"Loop\" option.\n</p><p> <strong>For questions please contact:</strong> <a href=\"mailto:kosmas.kritsis@athenarc.gr\">kosmas.kritsis@athenarc.gr</a> \n</p>"
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
                        },
                        {        
                            value: "item3",
                            text: "30-40"
                        },
                        {
                            value: "item4",
                            text: "40-50"
                        },
                        {
                            value: "item5",
                            text: "50-"
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
                        },
                        {
                            value: "item3",
                            text: "Prefer not to say"
                        }
                    ],
                    hasOther: false
                },
                {
                    type: "rating",
                    name: "question3",
                    title: "Are you familiar with the concepts of Machine Learning and Artificial Inteligence?",
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
}



// Function for sending post request to flask server
function sendDataToServer(sender, options){
    
    options.showDataSaving();
    console.log("sender: ", sender);
    console.log("survey_videos_table_shuf: ", survey_videos_table_shuf);
    dataJSON = {}
    dataJSON.answers = sender.data
    dataJSON.survey = survey_videos_table_shuf
    dataJSON.songs = val_songs_lst
    dataJSON.clips = vid_clips_lst
    
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

// Shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };


// Get random positive integers
// Example output: myRandomInts(6, 20) -> {7, 15, 4, 19, 14, 3}
function myRandomInts(quantity, max){
    const set = new Set()
    while(set.size < quantity) {
      set.add(Math.floor(Math.random() * max) + 1)
    }
    return set
  };





// Get random numbers to create the AB pairs
// We have 10 pairs of models:
// GT-MM, GT-NIPS, GT-ICMI, GT-NEW, NEW-MM, NEW-NIPS, NEW-ICMI, MM-NIPS, MM-ICMI, NIPS-ICMI
// For 20 AB tests we want 2 random song numbers from the 9 validation songs and select randomly 2 clips for each model in the survey

pair_groups_lst = [
    ['gt','mm'], 
    ['gt','nips'], 
    ['gt','icmi'], 
    ['gt','new'], 
    ['new','mm'], 
    ['new','nips'], 
    ['new','icmi'], 
    ['mm','nips'], 
    ['mm','icmi'], 
    ['nips','icmi']
];

// We have 3 resolutions of ground truth to match the different resolutions in direct comparisons. 
// MM is in 10FPS, NIPS is in 15FPS, ICMI and NEW in 30FPS
gt_fps_lst = ['10fps','15fps','30fps']

// Validation songs
// val_songs_lst = ['9_audio-','13_audio-','18_audio-','45_audio-','57_audio-','62_audio-','72_audio-','82_audio-','83_audio-'];
val_songs_lst = ['9_audio-','13_audio-','18_audio-','45_audio-',];

// Create a list for the number of video clips
// var n_clips_per_model = 9
var n_clips_per_model = 4
var vid_clips_lst = [];
for (var i = 0; i <= n_clips_per_model; i++) {
    vid_clips_lst.push(i);
} 
// console.log("vid_clips_lst: ", vid_clips_lst);

// select 2 songs for each group
var rand_group_songs = [];
for (var i = 0; i < pair_groups_lst.length; i++){
    var rand_group_song = myRandomInts( 2, val_songs_lst.length-1)
    rand_group_songs.push(rand_group_song)
}
// console.log("rand_group_songs: ", rand_group_songs);


// select 2 clip numbers for the audios of the groups
var rand_group_clips = [];
for (var i = 0; i < pair_groups_lst.length; i++){
    var rand_group_clip = myRandomInts( 2, vid_clips_lst.length-1)
    rand_group_clips.push(rand_group_clip)
}
// console.log("rand_group_clips: ", rand_group_clips);



survey_pairs_models = pair_groups_lst.slice()
survey_pairs_models = survey_pairs_models.concat(pair_groups_lst.slice())

survey_pairs_songs = []
for (var i = 0; i < rand_group_songs.length; i++){
    survey_pairs_songs.push([...rand_group_songs[i]][0])
    survey_pairs_songs.push([...rand_group_songs[i]][1])
}

survey_pairs_clips = []
for (var i = 0; i < rand_group_clips.length; i++){
    survey_pairs_clips.push([...rand_group_clips[i]][0])
    survey_pairs_clips.push([...rand_group_clips[i]][1])
}



survey_videos_table = [...survey_pairs_models];
survey_videos_table = survey_videos_table.map((item, index) => ([item, survey_pairs_songs[index]]));

for (var i = 0; i < survey_videos_table.length; i++){
    survey_videos_table[i].push(survey_pairs_clips[i]);
}


survey_videos_table_shuf = [...survey_videos_table];
for (var i = 0; i < 20; i++){
    shuffle(survey_videos_table_shuf);
}



// Create dynamically the video  AB pairs for creating the corresponding HTML code to include in the test page
var survey_videos_html = []
var video1 = []
var video2 = []

for (var i=0; i<survey_videos_table_shuf.length; i++){
    var group = survey_videos_table_shuf[i][0]
    var song = survey_videos_table_shuf[i][1]
    var clip = survey_videos_table_shuf[i][2]

    if (group[0] == "gt" ){
        
        switch(group[1]) {
            case "mm":
                video1 = group[0]+"10fps/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
                break;
            case "nips":
                video1 = group[0]+"15fps/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
                break;
            default:
                video1 = group[0]+"30fps/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
        }
        // video1 = group[0]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
        video2 = group[1]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
    }

    else if (group[1] == "gt"){
        switch(group[0]) {
            case "mm":
                video2 = group[1]+"10fps/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
                break;
            case "nips":
                video2 = group[1]+"15fps/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
                break;
            default:
                video2 = group[1]+"30fps/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
        }
        video1 = group[0]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
        // video2 = group[1]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
    }
    else{
        video1 = group[0]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
        video2 = group[1]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
    }

    // video1 = group[0]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
    // video2 = group[1]+"/"+ val_songs_lst[song] + vid_clips_lst[clip] + ".mp4"
    var videos_html = 
        `<table>
        <tr>
        <th>Video A</th>
        <th>Video B</th>
        </tr> 
        <tr>
        <td>
        <video style='border: 1px solid #b2b2b2;' width=\"432\" height=\"288\" controls><source src=\"${window.location.href}static/vids/${video1}\" type=\"video/mp4\">Your browser does not support the video tag.</video>
        </td>
        <td><video style='border: 1px solid #b2b2b2;' width=\"432\" height=\"288\" controls><source src=\"${window.location.href}static/vids/${video2}\" type=\"video/mp4\">Your browser does not support the video tag.</video>
        </td>
        </tr>
        </table>`
    // console.log(i)
    // console.log("A: ",video1)
    // console.log("B: ",video2)
    survey_videos_html.push(videos_html)
}




// We declare the format of the page that includes each wav audio with the rating question
var defTestPage = {
    name: "Test ",
    questions: [
        {
            type: "html",
            name: "videos-",
            html: "test"
        },
        {
            type: "rating",
            name: "question1-",
            title: "Which dance is more realistic regardless of music?",
            isRequired: true,
            rateValues: [
                {
                    value: 1,
                    text: "A"
                },
                {
                    value: 2,
                    text: "B"
                }
            ],
            rateMax: 2
        },
        {
            type: "rating",
            name: "question2-",
            title: "Which dance matches the music better?",
            // startWithNewLine: false,
            isRequired: true,
            rateValues: [
                {
                    value: 1,
                    text: "A"
                },
                {
                    value: 2,
                    text: "B"
                }
            ],
            rateMax: 2
        }
    ],
    title: "Test ",
    description: " Please watch the embedded video and answer the questions. "
};





var surveyJSON = JSON.parse(JSON.stringify(defsurveyJSON));

for (var i=0; i< survey_videos_html.length; i++){

    idxTest = i + 1;
    idxQ = idxTest

    testPage = JSON.parse(JSON.stringify(defTestPage));
    testPage.name = testPage.name + idxTest;
    testPage.title = testPage.title + idxTest;
    new_html = survey_videos_html[i];
    testPage.questions[0].html = new_html;

    // console.log(new_html)
    testPage.questions[0].name = testPage.questions[0].name + idxQ;

    testPage.questions[1].name = testPage.questions[1].name + idxQ;
   
    testPage.questions[2].name = testPage.questions[2].name + idxQ;
    
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