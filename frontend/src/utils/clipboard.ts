export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

export const copyAllPosts = (posts: Array<{ platform: string; content: string }>, platformNames: Record<string, string>): string => {
  return posts.map(post => `${platformNames[post.platform]}:\n${post.content}\n`).join('\n');
};

export const formatScheduledTime = (scheduledTime: string): string => {
  const date = new Date(scheduledTime);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
