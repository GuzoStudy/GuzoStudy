// test-course.js
const mongoose = require('mongoose');
const Course = require('./src/models/course.model');
mongoose.connect('mongodb+srv://selamkiflay10:guzo2222@guzo.6iswuqh.mongodb.net/guzostudy?retryWrites=true&w=majority')
  .then(async () => {
    const course = await Course.findById('68ae8b75fa126da04854168b');
    console.log('Course:', course);
    mongoose.disconnect();
  })
  .catch(console.error);