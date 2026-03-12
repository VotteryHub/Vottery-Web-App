import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const QuestionModerationPanel = ({ questions, onModerateQuestion, onRefresh, allowQuestions }) => {
  const [filter, setFilter] = useState('pending');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [moderatorNotes, setModeratorNotes] = useState('');

  const filteredQuestions = questions?.filter(q => 
    filter === 'all' ? true : q?.moderationStatus === filter
  );

  const handleModerate = (questionId, action) => {
    onModerateQuestion(questionId, action, moderatorNotes);
    setSelectedQuestion(null);
    setModeratorNotes('');
  };

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'destructive',
    flagged: 'error'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">
              Question Moderation Queue
            </h3>
            <p className="text-sm text-muted-foreground">
              {allowQuestions ? 'Audience questions enabled' : 'Audience questions disabled'}
            </p>
          </div>
          <Button onClick={onRefresh} iconName="RefreshCw" size="sm" variant="outline">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4">
          {['all', 'pending', 'approved', 'rejected', 'flagged']?.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
              <span className="ml-2 text-xs">
                ({questions?.filter(q => status === 'all' || q?.moderationStatus === status)?.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions?.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageSquare" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No questions to moderate</p>
          </div>
        ) : (
          filteredQuestions?.map(question => (
            <div
              key={question?.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {!question?.isAnonymous && question?.userProfiles && (
                  <div className="flex-shrink-0">
                    {question?.userProfiles?.avatar ? (
                      <Image
                        src={question?.userProfiles?.avatar}
                        alt={`${question?.userProfiles?.name} profile picture`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="User" size={24} className="text-primary" />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {question?.isAnonymous ? (
                      <span className="text-sm font-medium text-muted-foreground">Anonymous</span>
                    ) : (
                      <span className="text-sm font-medium text-foreground">
                        {question?.userProfiles?.name || 'Unknown User'}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColors?.[question?.moderationStatus]}/10 text-${statusColors?.[question?.moderationStatus]}`}>
                      {question?.moderationStatus}
                    </span>
                    {question?.upvotes > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="ThumbsUp" size={14} />
                        {question?.upvotes}
                      </span>
                    )}
                  </div>

                  <p className="text-foreground mb-3">{question?.questionText}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={14} />
                    {new Date(question?.createdAt)?.toLocaleString()}
                  </div>

                  {question?.moderationStatus === 'pending' && (
                    <div className="mt-4 flex items-center gap-2">
                      <Button
                        onClick={() => handleModerate(question?.id, 'approve')}
                        iconName="Check"
                        size="sm"
                        variant="success"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleModerate(question?.id, 'reject')}
                        iconName="X"
                        size="sm"
                        variant="destructive"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleModerate(question?.id, 'flagged')}
                        iconName="Flag"
                        size="sm"
                        variant="warning"
                      >
                        Flag
                      </Button>
                    </div>
                  )}

                  {question?.moderatorNotes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Moderator Notes:</strong> {question?.moderatorNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionModerationPanel;