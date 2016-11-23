var model = {
  days: 12,

  students: [],

  addStudent: function(name) {
    function getRandom() {
      return (Math.random() >= 0.5);
    }

    var student = {
      name: name,
      attendance: [],
      missed: 0,
    }

    for (var i = 0; i < this.days; i++) {
      attendance = getRandom();
      student.attendance.push(attendance);

      if (attendance == false) {
        student.missed += 1;
      }
    }

    this.students.push(student);
  },


  init: function() {
    if (!localStorage.students) {
      console.log('Creating attendance records...');
      function getRandom() {
        return (Math.random() >= 0.5);
      }

      this.addStudent('Slappy the Frog');
      this.addStudent('Lilly the Lizard');
      this.addStudent('Paulrus the Walrus');
      this.addStudent('Gregory the Goat');
      this.addStudent('Adam the Anaconda');

      localStorage.students = JSON.stringify(this.students);
    }
    this.students = JSON.parse(localStorage.students);
  }
};

var octopus = {
  getDays: function() {
    return model.days;
  },

  getStudents: function() {
    return model.students;
  },

  updateStudents: function(students) {
    this.students = students;
    localStorage.students = JSON.stringify(this.students);
  },

  init: function() {
    model.init();
    view.init();
  }
};

var view = {
  buildTableHeader: function(theadElem) {
    var days = octopus.getDays();
    var trElem = document.createElement('tr');
    var studentNameElem = document.createElement('th');
    var missedElem = document.createElement('th');

    studentNameElem.className = 'name-col';
    studentNameElem.textContent = 'Student Name';

    trElem.appendChild(studentNameElem);

    for (var i = 0; i < days; i++) {
      var dayElem = document.createElement('th');
      dayElem.textContent = i + 1;
      trElem.appendChild(dayElem);
    }

    missedElem.className = 'missed-col';
    missedElem.textContent = 'Days Missed-col';

    trElem.appendChild(missedElem);

    theadElem.appendChild(trElem);
  },

  buildStudentRow: function(student) {
    var days = octopus.getDays();
    var trElem = document.createElement('tr');
    var studentNameElem = document.createElement('td');
    var missedElem = document.createElement('td');

    trElem.className = 'student';

    studentNameElem.className = 'name-col';
    studentNameElem.textContent = student.name;

    trElem.appendChild(studentNameElem);

    for (var i = 0; i < days; i++) {
      var attendElem = document.createElement('td');
      var inputElem = document.createElement('input');

      attendElem.className = 'attend-col';
      inputElem.type = 'checkbox';

      if (student.attendance[i])
        inputElem.checked = true;

      inputElem.addEventListener('click', this.countMissing);

      attendElem.appendChild(inputElem);

      trElem.appendChild(attendElem);
    }

    missedElem.className = 'missed-col';
    missedElem.textContent = student.missed;

    trElem.appendChild(missedElem);

    return trElem;
  },

  buildTableBody: function(tbodyElem) {
    var students = octopus.getStudents();

    students.forEach(function(student) {
      tbodyElem.appendChild(this.buildStudentRow(student));
    }, this);
  },

  buildTable: function() {
    var tableElem = document.createElement('table');
    var theadElem = document.createElement('thead');
    var tbodyElem = document.createElement('tbody');

    this.buildTableHeader(theadElem);
    tableElem.appendChild(theadElem);

    this.buildTableBody(tbodyElem);
    tableElem.appendChild(tbodyElem);

    document.body.appendChild(tableElem);
  },

  init: function() {
    this.buildTable();
  },

  countMissing: function() {
    var students = octopus.getStudents();
    var studentRows = document.getElementsByClassName('student');

    for (var i = 0; i < students.length; i++) {
      var checkboxes = studentRows[i].getElementsByTagName('input');
      var missedElem = studentRows[i].getElementsByClassName('missed-col')[0];
      var attendance = [];
      var missed = 0;

      Array.prototype.forEach.call(checkboxes, function(checkbox) {
        if (checkbox.checked) {
          attendance.push(true);
        } else {
          attendance.push(false);
          missed += 1;
        }
      });

      missedElem.textContent = missed;

      students[i].attendance = attendance;
      students[i].missed = missed;
    }

    octopus.updateStudents(students);
  }
};

octopus.init();
