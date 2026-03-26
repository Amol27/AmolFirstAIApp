export const colors = {
  // Background colors
  background: '#F8F8F8', // Light beige/off-white
  white: '#FFFFFF',
  
  // Primary colors - Red theme
  primary: '#E74C3C', // Beautiful red for navigation, titles, icons
  primaryLight: '#EC7063', // Lighter red for accent elements
  primaryDark: '#C0392B', // Darker red for hover states
  
  // Text colors
  textPrimary: '#2C3E50', // Dark blue/indigo for titles (kept for readability)
  textSecondary: '#808080', // Grey for descriptive text
  textWhite: '#FFFFFF',
  
  // Accent colors
  success: '#27AE60', // Green for notifications
  warning: '#F39C12', // Orange for warnings
  info: '#3498DB', // Blue for information
  
  // Shadow and border
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: '#E0E0E0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLight: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.card,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  navigationBar: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg, // Extra padding for status bar
  },
};
