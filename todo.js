console.log("fail ühendatud");

class Entry{
    constructor(title, description, date, priority){
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
        this.priority = priority;
    }
}

class Todo{
    constructor(){
        this.entries = JSON.parse(localStorage.getItem('entries')) || [];
        document.querySelector('#addButton').addEventListener('click', () => {this.addEntry()});
        this.render();
    }

    addEntry(){
        console.log("nupp töötab")
        const titleValue = document.querySelector('#title').value
        const descriptionValue = document.querySelector('#description').value
        const dateValue = document.querySelector('#date').value
        const priorityValue = document.querySelector('#priority').value
        
        this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));

        console.log(this.entries);
        this.save();
    }

    editEntry(val){
        val.title = document.querySelector('#title').value
        val.description = document.querySelector('#description').value
        val.date = document.querySelector('#date').value
        return val.title, val.description, val.date
    }

    render(){
        let  tasklist = document.querySelector('#taskList');
        if(document.querySelector('.todo-list')){
            document.querySelector('#taskList').removeChild(document.querySelector('.todo-list'));
        }

        const ul = document.createElement('ul');
        ul.className = "todo-list";

        //sorteerimine kuupäeva järgi
        this.entries.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement('li');
            const div = document.createElement('div');
            const deleteButton = document.createElement('button');
            const editButton = document.createElement('button');
            
            let year = entryValue.date.slice(0,4);
            let month = entryValue.date.slice(5,7);
            let day = entryValue.date.slice(8,10);

            deleteButton.innerText = "x";
            deleteButton.addEventListener('click', () => {
                this.entries.splice(entryIndex, 1);
                this.save();
            });
            editButton.innerText = "Muuda";
            editButton.addEventListener('click', () =>{
                this.editEntry(entryValue) //töötab kui tekstiväljadesse lisada muudetavad väärtused
                this.save();
            });
            //prioriteetide lisamine
            const prioritySelect = document.createElement('select');
            prioritySelect.id = "priority"
            const highPriority = document.createElement('option');
            highPriority.value = document.querySelector('#priority').options[1].value
            highPriority.innerText = "Kõrge"
            const mediumPriority = document.createElement('option');
            mediumPriority.value = document.querySelector('#priority').options[2].value
            mediumPriority.innerText = "Keskmine"
            const lowPriority = document.createElement('option');
            lowPriority.value = document.querySelector('#priority').options[3].value
            //https://stackoverflow.com/questions/14333797/finding-which-option-is-selected-in-select-without-jquery
            lowPriority.innerText = "Madal"
            prioritySelect.add(highPriority, 1)
            prioritySelect.add(mediumPriority, 2)
            prioritySelect.add(lowPriority, 3)
            prioritySelect.value = entryValue.priority
            prioritySelect.addEventListener('change', (e) => {
                if(prioritySelect.value == e.target.value){
                    entryValue.priority = prioritySelect.value
                    this.save();
                }
            });

            div.innerHTML = `<div>${entryIndex + 1}.</div><div>${entryValue.title}</div><div>${entryValue.description}</div><div>${day}.${month}.${year}</div>`;

            ul.appendChild(li);
            li.appendChild(div);
            li.appendChild(prioritySelect);
            li.appendChild(editButton);
            li.appendChild(deleteButton);

        });

        tasklist.appendChild(ul);
    }

    save(){
        localStorage.setItem('entries', JSON.stringify(this.entries));
        this.render();
    }
}


const todo = new Todo();