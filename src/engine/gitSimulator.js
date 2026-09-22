/**
 * Deterministic Git Simulation Engine
 *
 * Simulates a safe, in-memory Git repository for developer workflow exercises:
 * - Working tree, staging index, commit graph, branches, and merge operations.
 * - Resolves merge conflicts deterministically.
 * - Does NOT access the host filesystem or spawn git processes.
 */

export function createMockGitRepo(initialFiles = {}) {
  let workingTree = { ...initialFiles };
  let stagingIndex = {};
  let branches = {
    main: [],
  };
  let currentBranch = "main";
  let commitHistory = [];
  let commitCounter = 1000;

  return {
    getCurrentBranch() {
      return currentBranch;
    },

    getBranches() {
      return Object.keys(branches);
    },

    getWorkingTree() {
      return { ...workingTree };
    },

    getStaging() {
      return { ...stagingIndex };
    },

    getLog() {
      return [...commitHistory];
    },

    /** Write or modify a file in the working tree */
    writeFile(filePath, content) {
      workingTree[filePath] = content;
      return { success: true, filePath, status: "modified" };
    },

    /** Stage files for commit: git add <path> */
    add(filePath) {
      if (filePath === ".") {
        stagingIndex = { ...workingTree };
        return { success: true, staged: Object.keys(stagingIndex) };
      }
      if (workingTree[filePath] !== undefined) {
        stagingIndex[filePath] = workingTree[filePath];
        return { success: true, staged: [filePath] };
      }
      return { success: false, error: `File '${filePath}' not found in working tree` };
    },

    /** Create a commit: git commit -m <msg> */
    commit(message) {
      if (Object.keys(stagingIndex).length === 0) {
        return { success: false, error: "Nothing to commit" };
      }
      commitCounter += 1;
      const hash = `c${commitCounter.toString(16)}`;
      const commitObj = {
        hash,
        message,
        branch: currentBranch,
        files: { ...stagingIndex },
        timestamp: new Date().toISOString(),
      };

      commitHistory.unshift(commitObj);
      if (!branches[currentBranch]) {
        branches[currentBranch] = [];
      }
      branches[currentBranch].unshift(commitObj);
      stagingIndex = {};

      return { success: true, commit: commitObj };
    },

    /** Create a branch: git branch <name> */
    createBranch(branchName) {
      if (branches[branchName]) {
        return { success: false, error: `Branch '${branchName}' already exists` };
      }
      branches[branchName] = branches[currentBranch] ? [...branches[currentBranch]] : [];
      return { success: true, branch: branchName };
    },

    /** Switch branch: git checkout <name> / git switch <name> */
    checkout(branchName, createNew = false) {
      if (createNew) {
        this.createBranch(branchName);
      }
      if (!branches[branchName]) {
        return { success: false, error: `Branch '${branchName}' does not exist` };
      }
      currentBranch = branchName;
      return { success: true, currentBranch };
    },

    /** Merge another branch into current branch: git merge <sourceBranch> */
    merge(sourceBranch) {
      if (!branches[sourceBranch]) {
        return { success: false, error: `Branch '${sourceBranch}' not found` };
      }
      const sourceCommits = branches[sourceBranch];
      if (sourceCommits.length === 0) {
        return { success: true, message: "Already up to date" };
      }

      // Fast-forward or 3-way merge simulation
      const latestSource = sourceCommits[0];
      workingTree = { ...workingTree, ...(latestSource.files || {}) };
      stagingIndex = { ...workingTree };

      commitCounter += 1;
      const mergeCommit = {
        hash: `m${commitCounter.toString(16)}`,
        message: `Merge branch '${sourceBranch}' into ${currentBranch}`,
        branch: currentBranch,
        files: { ...workingTree },
        timestamp: new Date().toISOString(),
      };

      commitHistory.unshift(mergeCommit);
      branches[currentBranch].unshift(mergeCommit);
      stagingIndex = {};

      return { success: true, mergeCommit };
    },

    /** Get status summary: git status */
    status() {
      const stagedKeys = Object.keys(stagingIndex);
      const workingKeys = Object.keys(workingTree);
      return {
        currentBranch,
        stagedCount: stagedKeys.length,
        stagedFiles: stagedKeys,
        workingFilesCount: workingKeys.length,
        isClean: stagedKeys.length === 0,
      };
    },
  };
}
