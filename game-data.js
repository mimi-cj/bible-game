// Biblical Board Game - Questions, Actions and Answers Data
const gameData = {
  "cards": [
    {
      "id": 1,
      "type": "question",
      "content": "What did Paul tell Timothy not to do?",
      "options": [
        "a) listen to false teachers",
        "b) drink wine"
      ],
      "answer": "a) listen to false teachers",
      "iconType": "teacher"
    },
    {
      "id": 2,
      "type": "action",
      "content": "You have listened to a false teacher. Move 4 spaces back.",
      "iconType": "warning"
    },
    {
      "id": 3,
      "type": "action",
      "content": "You held firmly to the teachings you have received and to pass them on to others. Move 4 spaces forwards.",
      "iconType": "teach"
    },
    {
      "id": 4,
      "type": "question",
      "content": "Name 3 things that Paul encouraged Timothy to do.",
      "answer": "Be faithful in his work, Keep teaching sound doctrine, Be a good example to others, Be a soldier of Christ, Share in faith, Comfort corruption, Encourage believers, Be watchful and sober-minded.",
      "iconType": "list"
    },
    {
      "id": 5,
      "type": "question",
      "content": "Name 5 things Paul warned Timothy about.",
      "answer": "Difficult times: Lovers of themselves/ money/ boastful/ proud, abusive, and disobedient to their parents, among other negative characteristics, Apostasy, False teachers, Persecution, Fruitless debates.",
      "iconType": "warning"
    },
    {
      "id": 6,
      "type": "action",
      "content": "You did nothing about those who have become lovers of themselves and lovers of money. Move 7 spaces back.",
      "iconType": "money"
    },
    {
      "id": 7,
      "type": "action",
      "content": "You've been continuing the work you have been doing, demonstrating faithfulness and perseverance. Move 6 spaces forwards.",
      "iconType": "faith"
    },
    {
      "id": 8,
      "type": "question",
      "content": "What did Paul tell Timothy to do?",
      "options": [
        "comfort corruption",
        "face persecution"
      ],
      "answer": "comfort corruption",
      "iconType": "guidance"
    },
    {
      "id": 9,
      "type": "question",
      "content": "Name 1 thing Paul told Timothy to do and 1 for him to not do.",
      "answer": "To do: Be faithful in his work, Keep teaching sound doctrine, Be a good example to others, Be a soldier of Christ, Share in faith, Comfort corruption, Encourage believers, Be watchful and sober-minded. \n\nNot to do: Listen to false teachers, Engage in fruitless debates, Be ashamed of the gospel.",
      "iconType": "instruction"
    },
    {
      "id": 10,
      "type": "question",
      "content": "Where was Paul living while he was writing letters to Timothy?",
      "answer": "Paul was imprisoned in Rome.",
      "iconType": "prison"
    },
    {
      "id": 11,
      "type": "question",
      "content": "Where was Timothy while Paul was imprisoned in Rome?",
      "answer": "Timothy was in Ephesus while Paul was imprisoned.",
      "iconType": "map"
    },
    {
      "id": 12,
      "type": "question",
      "content": "Why was Paul imprisoned in Rome?",
      "answer": "He was imprisoned in Rome for his ministry and teaching about Jesus.",
      "iconType": "prison"
    },
    {
      "id": 13,
      "type": "action",
      "content": "You've been a good example to others. Move 5 spaces forwards.",
      "iconType": "example"
    },
    {
      "id": 14,
      "type": "action",
      "content": "You let the false teachers say false things instead of confronting their corrupted ways. Move 5 spaces back.",
      "iconType": "warning"
    },
    {
      "id": 15,
      "type": "question",
      "content": "Multiple choice: What did Paul tell Timothy to do?",
      "options": [
        "a) Comfort corruption",
        "b) listen to false teachers",
        "c) Face persecution",
        "d) Encourage believers"
      ],
      "answer": "a) Comfort corruption, d) Encourage believers",
      "iconType": "choice"
    },
    {
      "id": 16,
      "type": "question",
      "content": "What does Paul mean by \"Comfort corruption\"?",
      "answer": "Paul encourages Timothy to confront false teachers and those who are not living in accordance with the gospel.",
      "iconType": "teach"
    },
    {
      "id": 17,
      "type": "question",
      "content": "Is listening to false teachers a good thing?",
      "answer": "No",
      "iconType": "warning"
    },
    {
      "id": 18,
      "type": "question",
      "content": "What does Paul want Timothy to share with others?",
      "answer": "Paul wants Timothy to share the faith.",
      "iconType": "share"
    },
    {
      "id": 19,
      "type": "question",
      "content": "What was Timothy's role at the church he served at?",
      "answer": "Timothy was a leader in the church he served at.",
      "iconType": "leader"
    },
    {
      "id": 20,
      "type": "question",
      "content": "What is Timothy encouraged to do with his faith in 2 Timothy 1:8?",
      "answer": "Do not be ashamed to testify about our Lord.",
      "iconType": "faith"
    },
    {
      "id": 21,
      "type": "question",
      "content": "The promise of life is promised in whom?",
      "answer": "In Christ Jesus.",
      "iconType": "promise"
    },
    {
      "id": 22,
      "type": "question",
      "content": "Life and immortality were brought to light through what?",
      "answer": "The gospel.",
      "iconType": "light"
    },
    {
      "id": 23,
      "type": "question",
      "content": "The Lord shall deliver me from what?",
      "answer": "Every evil work.",
      "iconType": "deliverance"
    },
    {
      "id": 24,
      "type": "question",
      "content": "The servant of the Lord must do what?",
      "answer": "Strive.",
      "iconType": "work"
    },
    {
      "id": 25,
      "type": "question",
      "content": "If we deny Christ, he will do what?",
      "answer": "He will deny us.",
      "iconType": "warning"
    },
    {
      "id": 26,
      "type": "question",
      "content": "Perilous times shall come when?",
      "answer": "In the last days.",
      "iconType": "time"
    },
    {
      "id": 27,
      "type": "question",
      "content": "All scripture is given how?",
      "answer": "They are all scripted by inspiration of God.",
      "iconType": "scripture"
    },
    {
      "id": 28,
      "type": "question",
      "content": "What 2 verses does 2 Timothy talk about false teachers?",
      "answer": "2:14-26 and 3:1-9",
      "iconType": "bible"
    },
    {
      "id": 29,
      "type": "question",
      "content": "Why does Paul want Timothy to teach others about Jesus?",
      "answer": "To ensure the continuation of sound doctrine, to equip future leaders with the truth, and to encourage Timothy's own faith and ministry despite challenges.",
      "iconType": "teach"
    },
    {
      "id": 30,
      "type": "question",
      "content": "Why does Paul warn Timothy about difficult times and apostasy that will arise in the last days?",
      "answer": "Because he is aware of the challenges Timothy will face in the future ministry, including false teachers and difficult times.",
      "iconType": "warning"
    }
  ],
  "iconTypes": {
    "teacher": {
      "path": "M20 17a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9.46c.35.61.54 1.3.54 2h10v11h-9v2h9zM15 7v2h2V7h-2zm-4 2h2V7h-2v2zm-4 6v2h2v-2H7zm-4 2h2v-2H3v2zm0-3h2v-2H3v2zm4 0h2v-2H7v2zm-4-3h2V9H3v2zm4 0h2V9H7v2zM3 7h2V5H3v2zm4 0h2V5H7v2z",
      "viewBox": "0 0 24 24"
    },
    "warning": {
      "path": "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
      "viewBox": "0 0 24 24"
    },
    "teach": {
      "path": "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
      "viewBox": "0 0 24 24"
    },
    "list": {
      "path": "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z",
      "viewBox": "0 0 24 24"
    },
    "money": {
      "path": "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
      "viewBox": "0 0 24 24"
    },
    "faith": {
      "path": "M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z",
      "viewBox": "0 0 24 24"
    },
    "guidance": {
      "path": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-5h10v2H7zm3.3-3.8L8.4 9.3 7 10.7l3.3 3.3L17 7.3l-1.4-1.4z",
      "viewBox": "0 0 24 24"
    },
    "instruction": {
      "path": "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
      "viewBox": "0 0 24 24"
    },
    "prison": {
      "path": "M18 4h2v16h-2zM4 4h2v16H4zm6 0h4v4h-4zM6 0v24h4V20h4v4h4V0h-4v4h-4V0H6z",
      "viewBox": "0 0 24 24"
    },
    "map": {
      "path": "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z",
      "viewBox": "0 0 24 24"
    },
    "example": {
      "path": "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
      "viewBox": "0 0 24 24"
    },
    "choice": {
      "path": "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
      "viewBox": "0 0 24 24"
    },
    "share": {
      "path": "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
      "viewBox": "0 0 24 24"
    },
    "leader": {
      "path": "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
      "viewBox": "0 0 24 24"
    },
    "promise": {
      "path": "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z",
      "viewBox": "0 0 24 24"
    },
    "light": {
      "path": "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z",
      "viewBox": "0 0 24 24"
    },
    "deliverance": {
      "path": "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
      "viewBox": "0 0 24 24"
    },
    "work": {
      "path": "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
      "viewBox": "0 0 24 24"
    },
    "time": {
      "path": "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
      "viewBox": "0 0 24 24"
    },
    "scripture": {
      "path": "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z",
      "viewBox": "0 0 24 24"
    },
    "bible": {
      "path": "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h2v8l2.5-1.5L13 12V4h5v16z",
      "viewBox": "0 0 24 24"
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = gameData;
}