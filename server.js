const express = require('express');
const hbs = require('hbs');

const fs = require('fs'   );

var app = express();

app.set('view engine', 'hbs');
//app.use(express.static(__dirname + '/public'));
var fetchToken = () => {
  try {
    var stringToken = fs.readFileSync('tokenNumber.json');
    return JSON.parse(stringToken);
  }
  catch (e) {
    console.log("File open error");
    return [];
  }
}

var saveToken = (tokenValue) => {
  token = {currentToken: tokenValue};
  fs.writeFileSync('tokenNumber.json', JSON.stringify(token))
};
var tokenValue = 0;
var token = fetchToken();
if (token.currentToken) {
  tokenValue = parseInt(token.currentToken);
}


app.use((req, res, next) => {
  var now = new Date().toString();
  var logs = `${now}: ${req.method}: ${req.url}`;
  console.log(logs);
  fs.appendFile('server_log.txt', logs + '\n', (error) => {
    if (error) {
      console.log('Unable to append logs in server_log');
    };
  });
  next();
});

app.get('/', (req, res) => {
  res.render('user.hbs', {
    getCurrentToken: tokenValue

  })
});

  
app.get('/admin', (req, res) => {
  res.render('admin.hbs', {
  getCurrentToken: tokenValue

});
});

app.get('/admin/changeToken', (req, res) => {
if (req.query.nbutton) {
  tokenValue++;
  saveToken(tokenValue);
}
if (req.query.pbutton && tokenValue > 1) {
  tokenValue--;
  saveToken(tokenValue);
}
if (req.query.rbutton) {
  tokenValue = 0;
  saveToken(tokenValue);
};
res.redirect('/admin');
});
app.listen(3000, () => {
  console.log('The server is running on port 3000');
});
