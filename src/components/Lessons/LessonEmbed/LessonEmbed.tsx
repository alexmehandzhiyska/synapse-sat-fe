import { useState } from 'react';
import type { ReactNode } from 'react';

import type { Lesson } from '../../../types/lesson';
import { getYoutubeEmbedUrl } from '../getYoutubeEmbedUrl';

type LessonEmbedProps = {
    lesson: Lesson;
    rightContent?: ReactNode;
};

const LessonEmbed = ({ lesson, rightContent }: LessonEmbedProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const embedUrl = getYoutubeEmbedUrl(lesson.videoUrl);

    const handleToggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="space-y-3 rounded-xl bg-white p-4">
            {embedUrl ? (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleToggleExpand}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            handleToggleExpand();
                        }
                    }}
                    className="flex flex-wrap cursor-pointer items-center justify-between gap-3"
                >
                    <p className="text-sm font-bold text-[#2f61c9]">
                        {lesson.title} {isExpanded ? '▾' : '▸'}
                    </p>
                    {rightContent}
                </div>
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-[#2f61c9] hover:text-[#244fa8]"
                    >
                        {lesson.title} ↗
                    </a>
                    {rightContent}
                </div>
            )}

            {embedUrl && isExpanded && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                        src={embedUrl}
                        title={lesson.title}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
};

export default LessonEmbed;