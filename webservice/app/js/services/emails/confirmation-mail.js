
exports.create = function(to,name,link){

var message = {
    "html": "<html><head></head><body style='background-color:#F2F2F2;font-family:Helvetica Neue Light,Helvetica,Arial,sans-serif;'><table style='margin-left:-2%;background-color:white;width:100%'><tr style='padding:10px;'><td><img src='cid:IMAGECID1' width='18%' style='padding-left:16%'></td><td><img src='cid:IMAGECID2' width='33%' style='float: right; padding-right: 2.5%;'></td></tr></table><table border='1' style='margin-left:2.5%; height:40%;width:95%;border:0px;background-color:white;padding:4%;margin-top:-5%;border-top-left-radius:.4em;border-top-right-radius:.4em;margin-top:5%'><tr><td style='color:#0066FF;font-size:1.6em;border:0px'>Hii Avilash,</td></tr><tr><td style='font-size:1.3em;border:0px'>Welcome to leaf !, Verify your emailaddress below</td></tr></table><table border='1' style='margin-left:2.5%; height:40%;width:95%;border:0px;background-color:white;padding:4%;'></tr> <tr>          <th style='border:0px;font-weight:400;font-size:1.2em'><span style='color:white;background-color:#6699FF;border-radius:1em;padding:0.5em;padding-left:5%;padding-right:5%'><a href="+link+">Verify "+to+"</a></span></span></tr></table><table border='1' style='margin-left:2.5%; height:40%;width:95%;border:0px;background-color:white;padding:4%;font-size:1.2em'><td style='border:0px'>Thanks<br>Leaf Team<br><br>Need help Contact <a href='#'>Leaf Customer care</a></td></table><table style='margin-left:-2%;width:104.5%;padding:10px;font-size:0.7em;font-family:Helvetica Neue Light,Helvetica,Arial,sans-serif;font-weight:20'><tr style='padding:10px;font-size:0.85em'><tr><th colspan='2'  style='font-weight: 500;'> The email Was sent to avilash@leaf.com</td><tr>   <th colspan='2'  style='font-weight: 500;'> Dont want to receive this type of email <a href='#'>Usubscribe</a></td><tr><th colspan='2'  style='font-weight: 500;'>Have a Question? <a href='#'>Visit our Serviece centre</a></td><tr><th colspan='2'  style='font-weight: 500;'> Privacy Policy | Terms and Conditions</td></tr></tr></table></body></html>",
    "subject": "Confirmation-medd",
    "from_email": "dipesh0695@gmail.com",
    "from_name": "DC",
    "to": [{
            "email": "akigupta131@gmail.com",
            "name": "ads",
            "type": "to"
        }
        ],
    "headers": {
        "Reply-To": "dipesh0695@gmail.com"
    },
};

return message;
}