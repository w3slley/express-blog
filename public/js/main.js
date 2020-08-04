deleteButton = document.querySelector('.btn-danger')

deleteButton.onclick = function(e){
   if(confirm("You really want to delete this blogpost?")){
       this.submit()
   }
   else{
       e.preventDefault()
   }
}