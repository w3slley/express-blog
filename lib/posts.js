
exports.getPost = function(){ //function that returns the data we are going to use in the partial.
    return {
        post:[
            {
                id: 1,
                title: 'Blogpost 1',
                author: 'Weslley',
                date: '10/08/2019',
                content: 'This is the content of the blogpost 1!'
            },
            {
                id: 2,
                title: 'Blogpost 2',
                author: 'Weslley',
                date: '11/08/2019',
                content: 'This is the content of the blogpost 2!'
            },
            {
                id: 3,
                title: 'Blogpost 3',
                author: 'Victor',
                date: '11/08/2019',
                content: 'This is the content of the blogpost 3!'
            }
        ]
    };
}

