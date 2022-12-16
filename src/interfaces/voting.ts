export interface VotingQueryInterface {
    amountAnswer?: Number,
    answerStr?: String,
    createdAt?: String,
    endDate?: String,
    id?: Number,
    projectTitle?: String,
    queryContent?: String,
    queryTitle?: String,
    startDate?: String,
    totalResult?: String,
    updatedAt?: String,
    votedWeight?: Number
};

export interface VotingResultInterface {
    createdAt?: String,
    id?: Number,
    queryId?: Number,
    updatedAt?: String,
    userAddress?: String,
    votingState?: Number
};