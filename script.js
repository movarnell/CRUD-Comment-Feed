document.getElementById('submitBtn').addEventListener('click', () => {submitClick()});



class Comment {
    constructor (name, comment) {
        this.name = name;
        this.comment = comment;
    }
}




class CommentService {
    static url = 'https://6404d2b5eed195a99f76c0b3.mockapi.io/comments';

static getAllComments() {
    return $.get(this.url);
}

static getComment(id) {
    return $.get((this.url) + `/${id}`);
}

static createComment (name, comment){
    return $.post(this.url, name, comment);
}


static updateComment(id) {
    console.log(id);
   
    let comment = document.getElementById('editText').value;
    console.log(name);
    console.log(comment);
       
    return $.ajax({
        url: this.url + '/' + id,
        dataType: 'json',
        data: JSON.stringify({comment: comment }),
        contentType: 'application/json',
        type: 'PUT'
    }).then(() => {
        return CommentService.getAllComments();
    })
    .then((comments) => {
        DOMManager.render(comments);
    });
}

 
static deleteComment(id) {
    return $.ajax({
        url: this.url + `/${id}`,
        type: 'DELETE'
    });
}

}

class DOMManager {
static comments;

static getAllComments() {
    CommentService.getAllComments().then(comments => this.render(comments));
}

static updateComment(id) {
    CommentService.updateComment(id)
    .then(() => {
        return CommentService.getAllComments();
    })
    .then((comments) => this.render(comments));
};



static deleteComment(id) {
    CommentService.deleteComment(id)
    .then(() => {
        return CommentService.getAllComments();
    })
    .then((comments) => this.render(comments));
}

static createComment(name, comment) {
    CommentService.createComment(new Comment(name, comment))
    .then(() => {
        return CommentService.getAllComments();
    })
    .then((comments) => this.render(comments));
}

static render(comments) {
    this.comments = comments;
    $('#app').empty();
    for (let comment of comments) {
        $('#app').prepend(
`<div id="${comment.id} class="card">
<div class = "bg-light border border-dark border-1 m-3 p-2 shadow">
<h5>${comment.name} says,</h5>
<p>${comment.comment} </p>
<button class="btn btn-outline-primary" id="updateComment" onclick="DOMManager.updateComment('${comment.id}')">Edit</button>
<button class="btn btn-outline-danger" onclick="DOMManager.deleteComment('${comment.id}')">Delete</button>
</div>

</div>
`   )
console.log(`${comment.id}`);
console.log(`${comment.name}`);
     
    }
}


}
function submitClick(){
    let name = document.getElementById('fullName').value;
    let comment = document.getElementById('commentBox').value;
        DOMManager.createComment(name, comment);
        document.getElementById('fullName').value = "";
        document.getElementById('commentBox').value = "";
    };
DOMManager.getAllComments();