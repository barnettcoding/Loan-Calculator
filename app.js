//input variables
var startingDate = "";
var loanAmount;
var payFrequency
var installmentAmount;
var interestRate;

//helper variables
var interval = 30;
var interestAmount;
var totalToRepay;
var numberOfPayments;

//to format dollar amounts
let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

//Holiday object
const holidays23 = {
    "0,2": "New Year's Day",
    "0,16": "MLK Jr Day",
    "1,20": "Washington's Birthday",
    "4,29": "Memorial Day",
    "5,16": "Juneteenth",
    "6,4": "Independence Day",
    "8,4": "Labor Day",
    "9,9": "Columbus Day",
    "10,10": "Veteran's Day",
    "10,23": "Thanksgiving",
    "11,25": "Christmas",
  };

//Handle when form is submitted
document.getElementById("loan-form").addEventListener("submit", computeLoan);

function isHoliday(date) {
    {
        return !!holidays23[date.getMonth() + ',' + date.getDate()];
      }
}

function isWeekend(date) {
   return date.getDay() == 0 || date.getDay() == 6
}

function checkDate(date) {
    while (isWeekend(date) || isHoliday(date)) {
        date.setDate(date.getDate() + 1)
    }
}
function computeLoan(e) {
    
    loanAmount = document.getElementById("amount").value;
    startingDate = (document.getElementById("startDate").value);
    
    date = new Date(startingDate)
    date.setDate(date.getDate() + 1);
    
   
        
    if (isWeekend(date)) {
        alert('Please choose a start date that is not on the weekend');
}
    if (isHoliday(date)) {
        alert('Please choose a start date that is not a federal holiday');
    }

    
    interestRate = document.getElementById("interest").value;   
    installmentAmount = document.getElementById("payment").value;

    //get pay frequency from radio button selection
    var radioSelection = document.getElementsByName('flexRadioDefault');
    for(i = 0; i < radioSelection.length; i++) {
        if(radioSelection[i].checked)        
            payFrequency = radioSelection[i].value;
            
    }

    //convert inputs to floats
    parseFloat(loanAmount);
    parseFloat(interestRate);
    parseFloat(installmentAmount);
    
    switch (payFrequency) {
        case "Monthly": interval = 30;
            break;
        case "Weekly": interval = 7;
            break;
        case "Daily": interval = 1;
            break;
        default: interval = 0;
    }
    
    //calculate payments, interest, etc
    interestAmount = (interestRate / 100) * loanAmount;
    totalToRepay = interestAmount + Number(loanAmount);
    numberOfPayments = totalToRepay / installmentAmount;
    numberOfPayments = parseFloat(numberOfPayments)
    e.preventDefault();
    
    //Create payment table
    var paymentTable = document.getElementById("payments");

    paymentTable.innerHTML = `
    <tr>
                        <th className="col" scope="col" >Amount</th>                       
                        <th scope="col">Date</th>
                      </tr>
    `
    body = document.createElement("tbody")
    paymentTable.appendChild(body)
    body.setAttribute("id", "tbody")

    //add payments dynamically
    for (let i = 0; i < numberOfPayments; i++) {
        let formattedDate = date.toDateString();
        
        if (totalToRepay < installmentAmount) {
            installmentAmount = totalToRepay
        }
        let formattedAmount = USDollar.format(installmentAmount);
        var newRow = body.insertRow(i)
        newRow.innerHTML = `   
        <td>${formattedAmount}</td>
        <td>${formattedDate}</td>`

        totalToRepay -= installmentAmount
        date.setDate(date.getDate() + interval)
        checkDate(date)
}
}
