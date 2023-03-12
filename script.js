// Welcome to week 12 final project CRUD app - by: Michael Varnell
// The api for this is also tied to a live version at http://crud.michaelvarnell.com so there may be
// comments from users who have visited the site.

document.getElementById('submitBtn').addEventListener('click', () => { submitClick() });

// CLASS/CONSTRUCTOR FOR COMMENT
class Comment {
    constructor(name, comment) {
        this.name = name;
        this.comment = comment;
    }
}
// CLASS FOR SERVICES TO BE RUN
class CommentService {
    //STATIC URL FOR MY MOCK-API
    static url = 'https://6404d2b5eed195a99f76c0b3.mockapi.io/comments';

    // FUNCTION TO GET ALL COMMENTS FROM API
    static getAllComments() {
        return $.get(this.url);
    }
    // FUNCTION TO GET COMMENT BY ID
    static getComment(id) {
        return $.get((this.url) + `/${id}`);
    }
    // FUNCTION TO CREATE A COMMENT
    static createComment(name, comment) {
        return $.post(this.url, name, comment);
    }
    // FUNCTION TO UPDATE A COMMENT USING THE EDIT BUTTON
    static updateComment(id, comment) {
        console.log(id);
        $(`#editComment_${id}`).show();
        $(`#${id} p`).hide();

        console.log(comment);

        return $.ajax({
            url: this.url + '/' + id,
            dataType: 'json',
            data: JSON.stringify({ comment: comment }),
            contentType: 'application/json',
            type: 'PUT'
        }).then(() => {
            return CommentService.getAllComments();
        })
            .then((comments) => {
                DOMManager.render(comments);
            });
    }

// FUNCTION TO SEND DELETE A COMMENT BY ITS ID TO API
    static deleteComment(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

// CREATES THE DOM EACH TIME
class DOMManager {

    static getAllComments() {
        CommentService.getAllComments().then(comments => this.render(comments));
    }

// FUNCTION THAT GETS CALLED TO DELETE THE COMMENT
    static deleteComment(id) {
        CommentService.deleteComment(id)
            .then(() => {
                return CommentService.getAllComments();
            })
            .then((comments) => this.render(comments));
    }
// FUNCTION THAT IS CALLED TO CREATE A NEW COMMENT USING COMMENT CLASS AND COMMENTSERVICE
    static createComment(name, comment) {
        CommentService.createComment(new Comment(name, comment))
            .then(() => {
                return CommentService.getAllComments();
            })
            .then((comments) => this.render(comments));
    }



// THIS RENDERS EACH COMMENT ITERATING THROUGH EACH RECORD IN A FOR LOOP. 
    static render(comments) {
        this.comments = comments;
        $('#app').empty();
        for (let comment of comments) {
            $('#app').prepend(
                `<div id="${comment.id}" class="card bg-light border border-dark border-2 rounded-4 m-3 p-2 shadow">
                <div >
                    <h5>${comment.name} says,</h5>
                    <p>${comment.comment}</p>
                
                    <div id="editComment_${comment.id}" style="display:none;">
                        <textarea type="text" id="editText_${comment.id}" rows="5" cols="30" value="${comment.comment}">${comment.comment}</textarea>
                        <button class="btn btn-outline-primary" onclick="DOMManager.saveComment('${comment.id}')">Save</button>
                    </div>
                    
                    <button class="btn btn-outline-primary" id="updateComment" onclick="DOMManager.updateComment('${comment.id}')">Edit</button>
                    <button class="btn btn-outline-danger" onclick="DOMManager.deleteComment('${comment.id}')">Delete</button>
                </div>
            </div>`
            );
        }
    }

    static updateComment(id) {
        // Hide the comment text and display the edit textbox
        $(`#editComment_${id}`).show();
        $(`#${id} p`).hide();
    }

    static saveComment(id) {
        // Get the updated comment text from the edit textbox
        let comment = $(`#editText_${id}`).val();
        // Update the comment in the API and re-render the comments
        CommentService.updateComment(id, comment)
            .then(() => {
                return CommentService.getAllComments();
            })
            .then((comments) => this.render(comments));
    }
}

// THIS IS THE FUNCTION TO SUBMIT ENTERED TEXT IT ALSO RESETS THE TEXBOX VALUES
function submitClick() {
    let name = document.getElementById('fullName').value;
    let comment = document.getElementById('commentBox').value;
    DOMManager.createComment(name, comment);
    document.getElementById('fullName').value = "";
    document.getElementById('commentBox').value = "";
};
// CALLING THIS POPULATES THE COMMENTS LISTED ON THE API WHEN THE PAGE LOADS. 
DOMManager.getAllComments();