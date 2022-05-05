const tweetService = require("./tweets.service");

const createTweetController = async (req, res) => {

    try {
        const {message} = req.body;

        if(!message){
            res.status(400).send({message:"O Envie todos os dados necessários para a criação do tweet"});
        }

        const { id } = await tweetService.createTweetService(message, req.userId);

        return res.status(201).send({
            message:"Tweet criado com sucesso!",
            tweet: {id, message},
        })
    } catch (err) {
        res.status(500).send({ message: "Ops, erro no servidor, tente novamente mais tarde!" });
        console.log(err.message);
    }
};

const findAllTweetsController = async (req, res) => {
    let { limit, offset } = req.query;

    offset = Number(offset);
    limit = Number(limit);

    if (!offset) {
      offset = 0;
    }

    if (!limit) {
      limit = 2;
    }

    try {
        const tweets = await tweetService.findAllTweetsService(offset, limit);
        const total = await tweetService.countTweets();

        const currentUrl = req.baseUrl;

        const next = offset + limit;
        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null;

        const previous = offset - limit < 0 ? null : offset - limit;
        const previousUrl = previous != null? `${currentUrl}?limit=${limit}&offset=${previous}`: null;

        if (tweets.length === 0) {
            return res.status(404).send({ message: "Não existem tweets!" });
        }

        return res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,
            results: tweets.map((tweet) => ({
                id: tweet._id,
                message: tweet.message,
                likes: tweet.likes.length,
                comments: tweet.comments,
                retweets: tweet.retweets.length,
                name: tweet.user.name,
                username: tweet.user.username,
                avatar: tweet.user.avatar,
            })),
        })
    } catch (err) {
        res.status(500).send({ message: "Ops, erro no servidor, tente novamente mais tarde!" });
        console.log(err.message);
    }
};

const searchTweetController = async (req, res) => {
    const { message } = req.query;
  
    const tweets = await tweetService.searchTweetService(message);
  
    if (tweets.length === 0) {
      return res
        .status(404)
        .send({ message: "Não existem tweets com essa mensagem!" });
    }

    return res.send({
        tweets: tweets.map((tweet) => ({
          id: tweet._id,
          message: tweet.message,
          likes: tweet.likes.length,
          comments: tweet.comments.length,
          retweets: tweet.retweets.length,
          name: tweet.user.name,
          username: tweet.user.username,
          avatar: tweet.user.avatar,
        })),
    });
};
const likeTweetController = async (req, res) => {
    const { id } = req.params;
      
    const userId = req.userId;
    
    const tweetLiked = await tweetService.likesService(id, userId);
  
    if (tweetLiked.lastErrorObject.n === 0) {
        return res.status(400).send({ message: "Você já deu like neste tweet!"})
    };
    
    return res.send({
      message: "Like realizado com sucesso!"
    });
};

const retweetTweetController = async (req, res) => {
    const { id } = req.params;

    const userId = req.userId;

    const tweetRetweeted = await tweetService.retweetsService(id, userId);

    if (tweetRetweeted.lastErrorObject.n === 0) {
        return res
        .status(400)
        .send({ message: "Você já deu retweet neste tweet!" });
    }

    return res.send({
        message: "Retweet realizado com sucesso!",
    });
};

const commentTweetController = async (req, res) => {
    const { id } = req.params;
  
    const userId = req.userId;

    const { comment } = req.body;
  
    await tweetService.commentsService(id, userId, comment);
  
    return res.status(201).send({
      message: "Comentário realizado com sucesso!",
    });
};
  
module.exports = { 
    createTweetController, 
    findAllTweetsController, 
    searchTweetController,
    likeTweetController,
    retweetTweetController,
    commentTweetController
}