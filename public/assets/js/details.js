let notesBtn = document.querySelector("#editNotes")
let notesTextArea = document.querySelector('#notesTextArea')
let notes = "";

// Edit button
notesBtn.onclick = () => {
    // Saving previous text
    notes = notesTextArea.value

    // Create save button
    let saveBtn = document.createElement('button')
    saveBtn.setAttribute('class','btn bg-gradient-dark')
    saveBtn.style = 'margin: 5px 5px -20px 0px;'
    saveBtn.innerHTML = 'Save'
    saveBtn.onclick = async () => {
        let newNotes = notesTextArea.value
        let site_id = window.location.href.split('/').pop()

        let data = {
            site_id: site_id,
            notes: newNotes
        }

        let response = await fetch('/api/update_notes',{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        let res = await response.json()

        console.log(res);

        if(res.status == 'ok') {
            notesTextArea.disabled = true
            saveBtn.remove()
            cancelBtn.remove()  
        } else {
            saveBtn.setAttribute('class','btn bg-gradient-warning')
        }
    }

    // Create cancel button
    let cancelBtn = document.createElement('button')
    cancelBtn.setAttribute('class','btn btn-danger')
    cancelBtn.style = 'margin: 5px 5px -20px 5px;'
    cancelBtn.innerHTML = 'Cancel'
    cancelBtn.onclick = () => {
        notesTextArea.value = notes
        notesTextArea.disabled = true
        saveBtn.remove()
        cancelBtn.remove()
    }

    // Draw buttons
    notesTextArea.parentElement.append(saveBtn)
    notesTextArea.parentElement.append(cancelBtn)

    // Enable edit
    notesTextArea.disabled = false
}