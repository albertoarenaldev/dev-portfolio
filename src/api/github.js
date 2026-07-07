const GITHUB_API = 'https://api.github.com';

export async function fetchGitHubRepos(username) {
  const res = await fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=50`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const repos = await res.json();
  return repos
    .filter(repo => !repo.fork && !repo.archived)
    .map(repo => ({
      id: repo.id,
      title: repo.name,
      description: repo.description || 'Sin descripción',
      tech: [repo.language].filter(Boolean),
      github: repo.html_url,
      demo: repo.homepage || '',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: repo.updated_at,
      year: new Date(repo.created_at).getFullYear(),
      language: repo.language,
    }));
}

export async function fetchUserProfile(username) {
  const res = await fetch(`${GITHUB_API}/users/${username}`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}
