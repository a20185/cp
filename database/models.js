module.exports = {
    user : {
        username : {type:String , required : true},
        password : {type:String , required : true},
        id : {type:String , required : true},
        email : {type:String , required : true},
        phone : {type:String , required : true}
    },
    data : {
    	posts : {type: Array , required : true},
    	neverBeenInitialized : {type:String}
    },
    post : {
    	id: {type:String , required: true},
    	title : {type:String , required : true},
    	content: {type:String , required: true},
    	owner: {type:String , required: true},
    	comment: {type: Array , required: true}
    },
    comment: {
    	postid: {type:String , required:true},
    	id: {type:String , required:true},
    	title : {type:String , required: true},
    	content: {type:String , required: true},
    	owner: {type: String , required: true}
    }
};