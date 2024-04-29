const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { LocalStorage } = require('node-localstorage');
localStorage = new LocalStorage('./Scratch');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "schoolmangement",
});

con.connect();

// School Login

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const query =
    "select * from school where email='" +
    email +
    "' and password='" +
    password +
    "'";

  con.query(query, (error, result, index) => {
    if (result.length > 0) {
      localStorage.setItem('status', 'true');
      res.redirect("/home");
    } else {
      res.redirect("/");
    }
  });
});

app.get('/logout', (req, res) => {
  localStorage.removeItem('status');
  res.redirect('/');
})

// home

app.get("/home", (req, res) => {
  if (localStorage.getItem('status')) {
    res.render("home");
  }
  else {
    res.redirect('/');
  }
});

// Add Staff

app.get("/addstaff", (req, res) => {
  const query = "select * from standard";
  const query1 = "select * from divison";

  if (localStorage.getItem('status')) {
    con.query(query, (error, result, index) => {
      if (error) throw error;

      con.query(query1, (error, result1, index) => {
        if (error) throw error;
        res.render("addstaff", { result, result1 });
      });
    });
  }
  else {
    res.redirect('/');
  }
});

app.post("/addstaff", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var std = req.body.std;
  var div = req.body.div;
  const query =
    "insert into staff(name,email,password,std,divi)values('" +
    name +
    "','" +
    email +
    "','" +
    password +
    "','" +
    std +
    "','" +
    div +
    "')";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstaff");
  });
});

app.get("/viewstaff", (req, res) => {
  const query = "select * from staff";

  if (localStorage.getItem('status')) {
    con.query(query, (error, result, index) => {
      if (error) throw error;
      res.render("viewstaff", { result });
    });
  }
  else {
    res.redirect('/');
  }
});

app.get('/updatestaff/:id', (req, res) => {
  var id = req.params.id;
  const query = "SELECT * FROM staff where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;

    const query1 = "SELECT * FROM divison";
    con.query(query1, (error, result1, index) => {
      if (error) throw error;

      const query2 = "SELECT * FROM standard";
      con.query(query2, (error, result2, index) => {
        if (error) throw error;

        res.render('updatestaff', { result, result1, result2 });
      });
    });
  });
});

app.post('/updatestaff/:id', (req, res) => {
  const id = req.params.id;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var std = req.body.std;
  var div = req.body.div;

  const query = "update staff set name='" + name + "',email='" + email + "',password='" + password + "',std='" + std + "',divi='" + div + "' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect('/viewstaff');
  })
})

app.get("/deletestaff/:id", (req, res) => {
  var id = req.params.id;

  const query = "delete from staff where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstaff");
  });
});

// student

app.get("/addstudent", (req, res) => {
  const query = "select * from standard";
  const query1 = "select * from divison";

  if (localStorage.getItem('status')) {
    con.query(query, (error, result, index) => {
      if (error) throw error;

      con.query(query1, (error, result1, index) => {
        if (error) throw error;
        res.render("addstudent", { result, result1 });
      });
    });
  }
  else {
    res.redirect('/');
  }
});

app.post("/addstudent", (req, res) => {
  var rno = req.body.rno;
  var name = req.body.name;
  var std = req.body.std;
  var div = req.body.div;
  const query =
    "insert into student(rno,name,std,divi)values('" +
    rno +
    "','" +
    name +
    "','" +
    std +
    "','" +
    div +
    "')";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstudent");
  });
});

app.get("/viewstudent", (req, res) => {
  const query = "select * from student";
  if (localStorage.getItem('status')) {
    con.query(query, (error, result, index) => {
      if (error) throw error;
      res.render("viewstudent", { result });
    });
  }
  else {
    res.redirect('/');
  }
});

app.get('/updatestu/:id', (req, res) => {
  var id = req.params.id;
  const query = "SELECT * FROM student where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;

    const query1 = "SELECT * FROM divison";
    con.query(query1, (error, result1, index) => {
      if (error) throw error;

      const query2 = "SELECT * FROM standard";
      con.query(query2, (error, result2, index) => {
        if (error) throw error;

        res.render('updatestu', { result, result1, result2 });
      });
    });
  });
})

app.post('/updatestu/:id', (req, res) => {
  const id = req.params.id;
  var rno = req.body.rno;
  var name = req.body.name;
  var std = req.body.std;
  var div = req.body.div;

  const query = "update student set rno='" + rno + "', name='" + name + "',std='" + std + "',divi='" + div + "' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect('/viewstudent');
  })
})

app.get("/deletestu/:id", (req, res) => {
  var id = req.params.id;

  const query = "delete from student where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstudent");
  });
});

// Std

app.get("/addstd", (req, res) => {
  if (localStorage.getItem('status')) {
    res.render("addstd");
  }
  else {
    res.redirect('/');
  }
});

app.post("/addstd", (req, res) => {
  var std = req.body.std;
  const query = "INSERT INTO standard (std) VALUES ('" + std + "')";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/home");
  });
});

// View std

app.get("/viewstd", (req, res) => {
  let result = [];
  if (localStorage.getItem('status')) {
    res.render("viewstd", { result });
  }
  else {
    res.redirect('/');
  }
});

app.post("/viewstd", (req, res) => {
  var std = req.body.std;
  var div = req.body.div;
  const query =
    "select * from student where std='" + std + "' and divi='" + div + "'";
  con.query(query, (error, result, index) => {
    console.log(result);

    if (error) throw error;
    res.render("viewstd", { result });
  });
});

app.get("/delete/:id", (req, res) => {
  var id = req.params.id;

  const query = "delete from studnet where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewstd");
  });
});

// div

app.get("/adddiv", (req, res) => {
  const query = "select * from standard";
  if (localStorage.getItem('status')) {
    con.query(query, (error, result, index) => {
      if (error) throw error;
      res.render("adddiv", { result });
    });
  }
  else {
    res.redirect('/');
  }
});

app.post("/adddiv", (req, res) => {
  var div = req.body.div;
  var std = req.body.std;
  const query =
    "INSERT INTO divison (divi,std) VALUES ('" + div + "','" + std + "')";
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/home");
  });
});

// Staff login

app.get("/homestaff", (req, res) => {
  const query = "select * from student";
  if (localStorage.getItem('staff')) {
    con.query(query, (error, result, index) => {
      if (error) throw error;
      res.render("homestaff", { result });
      console.log(result);
    });
  }
  else {
    res.redirect('stafflogin')
  }
});

// app.post('/staff', (req, res) => {
//     var email = req.body.email;
//     var password = req.body.password;

//     const query = "SELECT id, name FROM staff WHERE email='" + email + "' AND password='" + password + "'";

//     con.query(query, (error, result, index) => {
//         if (result.length > 0) {
//             const teacherId = result[0].id;
//             const teacherName = result[0].name;

//             // Query student data associated with the teacher
//             const studentQuery = "SELECT * FROM students id='" + teacherId + "'";
//             con.query(studentQuery, (error, studentResult) => {
//                 if (error) {
//                     console.error(error);
//                     res.redirect('/');
//                     return;
//                 }

//                 // Pass teacher name and associated student data to the rendered view
//                 res.render('homestaff', { name: teacherName, students: studentResult });
//             });
//         }
//         else {
//             res.redirect('/');
//         }
//     })
// })

app.get("/stafflogin", (req, res) => {
  res.render("stafflogin");
});

app.post("/stafflogin", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const query =
    "select * from staff where email='" +
    email +
    "' and password='" +
    password +
    "'";

  con.query(query, (error, result, index) => {
    if (result.length > 0) {
      localStorage.setItem('staff', 'true')
      res.redirect("/homestaff");
    } else {
      res.redirect("/stafflogin");
    }
  });
});

// stnadrd view Student

app.get("/studentview", (req, res) => {
  const result = [];
  if (localStorage.getItem('staff')) {
    res.render("studentview", { result });
  }
  else {
    res.redirect('/stafflogin');
  }
});

app.post("/studentview", (req, res) => {
  var std = req.body.std;
  var div = req.body.div;
  const query =
    "select * from student where std='" + std + "' and divi='" + div + "'";
  con.query(query, (error, result, index) => {
    console.log("sdjkfbusdah", result);

    if (error) throw error;
    res.render("studentview", { result });
  });
});

// Add result

app.get("/addresult/:id", (req, res) => {
  // let result = [];
  const id = req.params.id
  const query = "select * from student where id=" + id;
  if (localStorage.getItem('staff')) {
    con.query(query, (error, result, index) => {
      res.render("addresult", { result });
    });
  }
  else {
    res.redirect('/stafflogin');
  }
});


app.post("/addresult/:id", (req, res) => {
  var rno = req.body.rno;
  var std = req.body.std;
  var div = req.body.div;
  var name = req.body.name;
  var s1 = req.body.s1;
  var s2 = req.body.s2;
  var s3 = req.body.s3;
  var s4 = req.body.s4;
  var total = parseFloat(s1) + parseFloat(s2) + parseFloat(s3) + parseFloat(s4);
  var per = parseFloat(total / 4);

  const query = "insert into result (rno,std,divi,name,s1,s2,s3,s4,total,per)values('" + rno + "','" + std + "','" + div + "','" + name + "','" + s1 + "','" + s2 + "','" + s3 + "','" + s4 + "','" + total + "','" + per + "')"
  con.query(query, (error, result, index) => {
    console.log("uwfg", result);
    res.redirect("/viewresult");
  });
});

app.get("/viewresult", (req, res) => {
  const query = "select * from result";
  // const query = "SELECT * FROM result ORDER BY standard";
  if (localStorage.getItem('status')) {
    con.query(query, (error, result, index) => {
      if (error) throw error
      res.render("viewresult", { result });
    });
  }
  else {
    res.redirect('/stafflogin')
  }
});

app.get('/updateres/:id', (req, res) => {
  var id = req.params.id;
  const query = "SELECT * FROM result where id=" + id;
  con.query(query, (error, result, index) => {
    res.render('updateres', { result });
  });
})

app.post('/updateres/:id', (req, res) => {
  const id = req.params.id;
  var s1 = req.body.s1;
  var s2 = req.body.s2;
  var s3 = req.body.s3;
  var s4 = req.body.s4;
  var total = parseFloat(s1) + parseFloat(s2) + parseFloat(s3) + parseFloat(s4);
  var per = parseFloat(total / 4);

  const query = "update result set s1='" + s1 + "',s2='" + s2 + "',s3='" + s3 + "',s4='" + s4 + "',total='" + total + "',per='" + per + "' where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect('/viewresult');
  })
})

app.get("/deleteres/:id", (req, res) => {
  var id = req.params.id;

  const query = "delete from result where id=" + id;
  con.query(query, (error, result, index) => {
    if (error) throw error;
    res.redirect("/viewresult");
  });
});

// std wise view result

app.get("/resultstd", (req, res) => {
  const result = [];
  if (localStorage.getItem('staff')) {
    res.render("resultstd", { result });
  }
  else {
    res.redirect('/stafflogin');
  }
});

app.post("/resultstd", (req, res) => {
  var std = req.body.std;
  var div = req.body.div;
  const query =
    "select * from result where std='" + std + "' and divi='" + div + "'";
  con.query(query, (error, result, index) => {
    console.log("sdjkfbusdah", result);

    if (error) throw error;
    res.render("resultstd", { result });
  });
});

// student result get

app.get("/results", (req, res) => {
  let result2 = [];
  let result3 = [];
  let result = [];
  const query = "select * from standard";
  con.query(query, (error, results, index) => {
    if (error) throw error;
    result = results;
  });
  const query1 = "select * from divison";
  con.query(query1, (error, result1, index) => {
    if (error) throw error;
    res.render("results", { result, result1, result2 });
  });
  //   res.render("results", { result3 });
});

app.post("/results", (req, res) => {
  var std = req.body.std;
  var div = req.body.div;
  var rno = req.body.rno;
  let result = [];
  let result1 = [];
  const query = "select * from standard";
  con.query(query, (error, results, index) => {
    if (error) throw error;
    result = results;
  });
  const query1 = "select * from divison";
  con.query(query1, (error, result, index) => {
    if (error) throw error;
    result1 = result;
  });
  const query3 =
    "SELECT * FROM result WHERE std='" +
    std +
    "' AND divi='" +
    div +
    "' AND rno='" +
    rno +
    "'";
  con.query(query3, (error, result2, index) => {
    if (error) throw error;
    console.log("post", result2);
    localStorage.setItem('student', 'true');
    res.render("results", { result, result1, result2 });
  });
});

// Top 3


app.get("/viewtop", (req, res) => {
  const result = [];
  if (localStorage.getItem('status')) {
    res.render("viewtop", { result });
  }
  else{
    res.redirect('/');
  }
});

app.post("/viewtop", (req, res) => {
  var std = req.body.std;
  var div = req.body.div;
  const query = "select * from result where std='" + std + "' and divi='" + div + "' ORDER BY per DESC LIMIT 3";
  con.query(query, (error, result, index) => {
    console.log("sdjkfbusdah", result);

    if (error) throw error;
    res.render("viewtop", { result });
  });
});


app.listen(4000);
