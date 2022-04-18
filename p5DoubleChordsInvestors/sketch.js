
// Global Variables:
let myData;
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
let companies = new Map();
let investors = new Map();

let topCompanies = [];
let topInvestors = [];
let topCompaniesNames = [];
let topInvestorsNames = [];
let r
let angle
let pointCount
var diameter
let list


// Responsive size:
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

// Load Data:
function preload() {
    myData = loadTable('data/investments.csv', 'csv', 'header');
}


//
/////
//////////
//////////////////////
//////////////////////////  SET UP  
function setup() {
    list = select('#List p')
    companyTitle = select('#List .companyTitle')
    investorTitle = select('#List .investorTitle')
    
    // textFont('Helvetica');
    textFont('Courier');

    // let r = 10
    // let angle = 0;
    // let pointCount = 100;

    let c = createCanvas(windowWidth, windowHeight);
    c.parent("my-sketch")

    //let's fix the rows (remove NaN) in data set
    for (let row of myData.rows) {
        let amt = row.get("amount_usd");
        if (amt == "") {       //if it's an empty string
            row.setNum("amount_usd", 0);
        }
    }

    for (let row of myData.rows) {
        let cname = row.getString("company_name");
        let iname = row.getString("investor_name")

        let company;
        let investor;
        let amt = row.getNum("amount_usd");
        let date = row.getString("funded_when")


        //??????
        if (companies.has(cname)) {
            company = companies.get(cname)
        } else {
            company = new Company(cname);
            companies.set(cname, company);
        }


        //??????
        if (investors.has(iname)) {
            investor = investors.get(iname)
        } else {
            investor = new Investor(iname);
            investors.set(iname, investor)
        }

        //////
        let investment = new Investment(company, investor, amt, date);

        company.investments.push(investment);
        company.total += amt;

        investor.investments.push(investment);
        investor.total = + amt
    }

    //compute TOP COMPANIES and TOP INVESTORS:
    let tC = Array.from(companies.values());  //top companies
    let tI = Array.from(investors.values()); // top investors

    tC.sort((a, b) => b.total - a.total); //descending 
    tI.sort((a, b) => b.total - a.total); //descending 


    // select top 100 way number 1
    for (let i = 0; i < 100; i++) {
        topCompanies.push(tC[i]);
        topInvestors.push(tI[i]);
    }

    for (let i = 0; i < 100; i++) {
        topCompaniesNames.push(topCompanies[i].name);
        topInvestorsNames.push(topInvestors[i].name);
    }

    // select top 100 way number 2
    // topCompanies = tC.slice(0, 100);
    // topInvestors = tI.slice(0, 100);


    // print(topCompanies)

}

//////////////////////////////////
///////////////////////
///////////
/////
//





//
/////
////////
///////////  DRAW

function draw() {
    background(13, 0, 0);
    hover();
    noStroke()





    //SET UP INDEX NUMBERS
    for (var i = 0; i < topCompanies.length; i++) {
        diameter = min(windowWidth, windowHeight) / 2.7
        topCompanies[i].index_number = i;
        topCompanies[i].x = diameter * Math.cos(radians(((360 / topCompanies.length) * i))) + width / 3.3;
        topCompanies[i].y = diameter * Math.sin(radians(((360 / topCompanies.length) * i))) + height / 2;
    }

    for (var i = 0; i < topInvestors.length; i++) {
        diameter = min(windowWidth, windowHeight) / 2.3
        topInvestors[i].index_number = i;
        topInvestors[i].x = (diameter * 0.5) * Math.cos(radians(((360 / topCompanies.length) * i))) + width / 3.3;
        topInvestors[i].y = (diameter * 0.5) * Math.sin(radians(((360 / topCompanies.length) * i))) + height / 2;
    }


    for (let d of topCompanies) {
        d.draw()

    }

    for (let i of topInvestors) {
        i.draw()
    }


    // LEGEND:
    push()
    noStroke()
    translate(width / 2, height * 0.85)
    fill(220, 0, 200, 200)
    ellipse(0, 0, 10)
    rectMode(CORNER)
    rect(10, 3.5, 40, 3)
    noStroke()
    textSize(7)
    fill(250, 250, 250, 250);
    textAlign(LEFT, CENTER)
    text("Investor", 0, -11)
    text("name", 10, -2.5)
    text("total investments", 55, 4)

    text("Legend:", 0, -25)

    push()
    translate(0, 33)
    fill(100, 210, 110, 200)
    ellipse(0, 0, 10)
    rectMode(CORNER)
    rect(10, 3.5, 40, 3)
    noStroke()
    textSize(7)
    fill(250, 250, 250, 250);
    textAlign(LEFT, CENTER)
    text("Company", 0, -11)
    text("name",  10, -2.5)
    text("ammount received",  55, 4)
    pop()


    function radius(d) {
        return sqrt(d / 1E6 / 4)
    }
    d1 = 40000000000
    d2 = 4000000000
    d3 = 400000000



    // Size Legend
    fill(250, 250, 250, 100);
    rectMode(CORNER)
    rect(160, 36.5, radius(d1), 3)
    textAlign(LEFT, CENTER)
    rect(160, 25.5, radius(d2), 3)
    rect(160, 14.5, radius(d3), 3)

    fill(250, 250, 250, 250);
    text("$40 Billion", 165 + radius(d1), 35.5)
    text("$4 Billion", 165 + radius(d2), 27.5)
    text("$400 Million", 165 + radius(d3), 16.5)


    pop()




}
/////////
/////
///
//




//
////
//////////
///////////////// calling HOVER 

function hover() {
    // noLoop()
    for (let c of topCompanies) {
        let d = dist(c.x, c.y, mouseX, mouseY);
        // c.hover = d < c.radius();
        c.hover = d < 10;
    }

    for (let i of topInvestors) {
        let d = dist(i.x, i.y, mouseX, mouseY);
        // i.hover = d < i.radius();
        i.hover = d < 10;
    }

}
///////////
/////////
////
//


function mousePressed() {
    select("#List p").html("");
    select("#List h1").html("")
    select(".investorTitle").html("");
    select(".companyTitle").html("");

    for (let c of topCompanies) {

        if (c.hover) {
            fill(0, 255, 0, 111, 250);
            for (let i of c.investments) {
                // FILTER INVESTORS OF COMPANY THAT ARE IN TOP 100:
                if (topInvestorsNames.includes(i.investor.name)) {
                    // on CLICK interactivity:
                    if (mouseIsPressed) {

                        // select("#List p").html("");

                        for (var index = 0; index < i.investor.investments.length; index++) {
                            // list is hidden
                            //list.html
                            list.html("<p>Investment by " + i.investor.investments[index].investor.name + " of " + i.investor.investments[index].amt + " on " + i.investor.investments[index].date + "<br></p>", width * 0.6, (width / 13) + 50 + 10 * index)
                            list.position(width * 0.6, height * 0.6)
                            companyTitle.html(c.name)
                            companyTitle.position(width * 0.6, height * 0.6 - 30)

                        }
                    }
                }

            }

        } else {

        }


    }


    for (let i of topInvestors) {

        if (i.hover) {
            fill(0, 255, 0, 111, 250);
            for (let c of i.investments) {
                // FILTER INVESTORS OF COMPANY THAT ARE IN TOP 100:
                if (topCompaniesNames.includes(c.company.name)) {
                    // on CLICK interactivity:
                    if (mouseIsPressed) {

                        // select("#List p").html("");

                        for (var index = 0; index < c.company.investments.length; index++) {
                            // list is hidden
                            //list.html
                            
                            list.html("<p>Invested in " + i.investments[index].company.name + " of " + i.investments[index].amt + " on " + i.investments[index].date + "<br> </p>", width * 0.6, (width / 13) + 50 + 10 * index);
                            list.position(width * 0.6, height * 0.6)
                            investorTitle.html(i.name)
                            investorTitle.position(width * 0.6, height * 0.6 - 30)

                        }
                    }
                }

            }

        } else {

        }


    }


}






// let e = select('#List p')
// e.html('hellooo world')



/////////////////////////////////
//////////// CLASSES ////////////
/////////////////////////////////

class Company {
    hover = false
    click = false
    name;
    investments;
    total = 0
    x
    y

    constructor(name) {
        this.name = name;
        this.investments = [];
        // this.x = random(width / 10, width / 2);
        // this.y = random(height / 10, height - height / 10)
    }
    //
    radius() {
        return sqrt(this.total / 1E6 / 4)
    }
    //
    draw() {

        // on HOVER:
        if (this.hover) {
            this.mousePressed
            fill(0, 255, 0, 111);
            // console.log(this)
            // console.log(this.investments[0])

            //select investments, investors names:
            for (let i of this.investments) {
                // console.log(topInvestorsNames)
                // FILTER INVESTORS OF COMPANY THAT ARE IN TOP 100:
                if (topInvestorsNames.includes(i.investor.name)) {
                    strokeWeight(2)
                    stroke(200, 200, 200)
                    line(i.investor.x, i.investor.y, this.x, this.y)
                    rectMode(CENTER)
                    fill(250, 250, 250, 250)
                    stroke(250, 250, 250, 150);
                    strokeWeight(1)
                    ellipse(i.investor.x, i.investor.y, 10)


                    // on CLICK interactivity:
                    if (mouseIsPressed) {
                        for (var index = 0; index < i.investor.investments.length; index++) {

                        }
                    }
                }

            }

        } else {

            noStroke()


            // Light LINES
            for (let i of this.investments) {
                // console.log(topInvestorsNames)
                // FILTER INVESTORS OF COMPANY THAT ARE IN TOP 100:
                if (topInvestorsNames.includes(i.investor.name)) {
                    strokeWeight(2)
                    // stroke(200, 200, 200, 11.1)
                    stroke(200, 200, 200, 21.1)
                    line(i.investor.x, i.investor.y, this.x, this.y)
                }
            }
        }


        // COMPANY CIRCLES and bars
        push()

        fill(100, 210, 110, 200)
        translate(this.x, this.y)
        ellipse(0, 0, 10)
        if (this.index_number > topInvestors.length / 4 && this.index_number < topInvestors.length * 3 / 4) {
            rectMode(CENTER)
            rotate(radians((360 / 100) * (this.index_number)));
            fill(100, 210, 110, 200)
            rect(10 + this.radius() / 2, -3, this.radius(), 3)
        } else {
            rectMode(CENTER)
            rotate(radians((360 / 100) * (this.index_number)));
            fill(100, 210, 110, 200)
            rect(10 + this.radius() / 2, 3.5, this.radius(), 3)

        }
        pop();

        // COMPANY LABELS
        push()
        noStroke()
        translate(this.x, this.y);
        if (this.index_number > topInvestors.length / 4 && this.index_number < topInvestors.length * 3 / 4) {
            // COMPANY LABELS
            scale(-1, -1);
            rotate(radians((360 / 100) * (this.index_number)));
            textSize(5)
            fill(250, 250, 250, 250);
            textAlign(LEFT, CENTER)
            text(this.name, -this.name.length * 3 - 10, -1);
        } else {
            rotate(radians((360 / 100) * (this.index_number)));
            textSize(5)
            fill(250, 250, 250, 250);
            textAlign(LEFT, CENTER)
            text(this.name, 10, 0);


        }
        pop();
    }
}




class Investor {
    name;
    investments;
    total;
    constructor(name) {
        this.name = name;
        this.investments = [];
    }

    radius() {
        return sqrt(this.total / 1E6 / 4)
    }


    draw() {
        // on Hover:
        if (this.hover) {
            fill(0, 255, 0, 111, 250);
            for (let c of this.investments) {
                if (topCompaniesNames.includes(c.company.name)) {

                    strokeWeight(2)
                    stroke(200, 200, 200)
                    line(c.company.x, c.company.y, this.x, this.y)


                    fill(250, 250, 250, 250)
                    stroke(250, 250, 250, 150);
                    strokeWeight(1)
                    ellipse(c.company.x, c.company.y, 10)

                }
            }
        } else {
            noStroke()
            fill(220, 0, 200, 200)

        }

        // Investors CIRCLES and bars
        push()
        // translate(this.x, this.y )
        rectMode(CORNER)
        // fill(220, 0, 200, 200)
        fill(220, 0, 200, 170) 
        translate(this.x, this.y);
        rotate(radians((360 / 100) * (this.index_number)));
        ellipse(0, 0, 10)
        if (this.index_number > topInvestors.length / 4 && this.index_number < topInvestors.length * 3 / 4) {
            rectMode(CENTER)
            fill(220, 0, 200, 200)
            rect(10 + this.radius() / 2, -3, this.radius(), 3)
            // rect(10 + map(this.total, 2E6 ,40E6, 1, 3) / 2, -3, map(this.total, 2E6 ,40E6, 1, 3), 3)
        } else {
            rectMode(CENTER)
            fill(220, 0, 200, 170)
            rect(10 + this.radius() / 2, 3.5, this.radius(), 3)
            // rect(10 + this.total / 1E6 / 4 / 2, 3.5, this.total / 1E6 / 4, 3)
            // rect(10 + map(this.total, 2E6 ,40E6, 1, 3) / 2, 3.5, map(this.total, 2E6 ,40E6, 1, 3), 3)

        }

        //map(this.total, min(2E6,40E6,10,400),max(2E6,40E6,10,400) )
        // this.total / 1E6 / 4
        // triangle(0,0,0,10,15,5)
        pop()

        // Investors Labels
        push()
        noStroke()
        translate(this.x, this.y);
        // if(this.index_number> topInvestors.length* 3/4 && this.index_number < topInvestors.length/4){
        if (this.index_number > topInvestors.length / 4 && this.index_number < topInvestors.length * 3 / 4) {
            scale(-1, -1);
            rotate(radians((360 / 100) * (this.index_number)));
            textSize(5)
            fill(250, 250, 250, 250);
            textAlign(LEFT, CENTER)
            text(this.name, -this.name.length * 3 - 10, -0.3);
        } else {
            rotate(radians((360 / 100) * (this.index_number)));
            textSize(5)
            fill(250, 250, 250, 250);
            textAlign(LEFT, CENTER)
            text(this.name, 10, 0);

        }
        pop();
    }

}



class Investment {
    company
    investor
    amt
    date

    constructor(company, investor, amt, date) {
        this.company = company;
        this.investor = investor;
        this.amt = amt;
        this.date = date;
    }
}






