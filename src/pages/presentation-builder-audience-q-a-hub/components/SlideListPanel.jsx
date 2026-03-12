import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SlideListPanel = ({ slides, selectedSlide, onSelectSlide, onCreateSlide, onDeleteSlide, onReorderSlides }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDragEnd = (result) => {
    if (!result?.destination) return;

    const items = Array.from(slides);
    const [reorderedItem] = items?.splice(result?.source?.index, 1);
    items?.splice(result?.destination?.index, 0, reorderedItem);

    onReorderSlides(items);
  };

  const handleDelete = (slideId) => {
    onDeleteSlide(slideId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-bold text-foreground">
          Slides ({slides?.length})
        </h3>
        <Button
          onClick={onCreateSlide}
          iconName="Plus"
          size="sm"
        >
          New Slide
        </Button>
      </div>

      {slides?.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Layout" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No slides yet</p>
          <Button onClick={onCreateSlide} iconName="Plus" size="sm">
            Create First Slide
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div
                {...provided?.droppableProps}
                ref={provided?.innerRef}
                className="space-y-3"
              >
                {slides?.map((slide, index) => (
                  <Draggable key={slide?.id} draggableId={slide?.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided?.innerRef}
                        {...provided?.draggableProps}
                        className={`border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                          selectedSlide?.id === slide?.id
                            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
                        } ${
                          snapshot?.isDragging ? 'shadow-lg scale-105' : ''
                        }`}
                        onClick={() => onSelectSlide(slide)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            {...provided?.dragHandleProps}
                            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing"
                          >
                            <Icon name="GripVertical" size={20} className="text-muted-foreground" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-muted-foreground">
                                #{index + 1}
                              </span>
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {slide?.title || 'Untitled Slide'}
                              </h4>
                            </div>
                            
                            {slide?.mediaUrl && (
                              <div className="w-full h-20 rounded-md overflow-hidden bg-muted mb-2">
                                <Image
                                  src={slide?.mediaUrl}
                                  alt={`Slide ${index + 1} preview showing ${slide?.title}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {slide?.content || 'No content'}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e?.stopPropagation();
                              setShowDeleteConfirm(slide?.id);
                            }}
                            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"
                          >
                            <Icon name="Trash2" size={16} className="text-destructive" />
                          </button>
                        </div>

                        {showDeleteConfirm === slide?.id && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Delete this slide?</p>
                            <div className="flex gap-2">
                              <Button
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  handleDelete(slide?.id);
                                }}
                                variant="destructive"
                                size="xs"
                              >
                                Delete
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e?.stopPropagation();
                                  setShowDeleteConfirm(null);
                                }}
                                variant="outline"
                                size="xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided?.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default SlideListPanel;