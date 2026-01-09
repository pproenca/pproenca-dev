## MODIFIED Requirements

### Requirement: Self-Contained Subscribe Button

The SubscribeButton component SHALL initialize the OneSignal SDK internally without requiring a separate provider component.

#### Scenario: Button initializes SDK on mount

- **WHEN** the SubscribeButton component mounts
- **THEN** it SHALL dynamically import and initialize the OneSignal SDK
- **AND** it SHALL display a loading/pending state until initialization completes
- **AND** it SHALL NOT require any parent provider component

#### Scenario: SDK loads only when button is rendered

- **WHEN** a page does NOT render the SubscribeButton
- **THEN** the OneSignal SDK SHALL NOT be loaded
- **AND** no OneSignal-related JavaScript SHALL execute

#### Scenario: Button handles initialization errors gracefully

- **WHEN** OneSignal SDK initialization fails (e.g., localhost without HTTPS)
- **THEN** the button SHALL log the error to console
- **AND** the button SHALL remain hidden (return null)
- **AND** no error SHALL be thrown to parent components

## REMOVED Requirements

### Requirement: OneSignal Provider Component

**Reason**: The provider pattern is no longer needed - initialization is handled by the button itself.

**Migration**: Remove `<OneSignalProvider />` from layout.tsx. The SubscribeButton now self-initializes.
